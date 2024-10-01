import puppeteer from "puppeteer";
import pino, { Logger } from "pino";
import { getLoginPage, generateExportURL } from "./urlBuilder";
import dotenv from "dotenv";
import { parse } from "csv-parse";
import { retryWrapper } from "./retryWrapper";
import { weatherDataAdapter } from "./adapter/weatherData/adapters";
import { DiscoveryDevice } from "../types/discovery/device";
import { deviceObj } from "./deviceObj";
import { WeatherData } from "../types/weatherData";

dotenv.config();

type AuthState = "authenticating" | "authenticated" | "failed"

export class PwlClient {
    private jwtToken: null | string = null;
    private authState: AuthState = "authenticating";
    private logger: Logger
    constructor() {
        this.logger = pino({
            level: (process.env.LOG_LEVEL || "info").toLowerCase(),
            name: "pwl-client",
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                }
            }
        });
        this.authenticate();
    }
    private async authenticate(): Promise<void> {
        this.authState = "authenticating";
        this.logger.info("Authenticating");
        try {
            await retryWrapper(this.authenticateInternal.bind(this), 3);
            this.authState = "authenticated";
            this.logger.info("Authenticated");
        } catch (e) {
            this.authState = "failed";
            this.logger.error("Failed to authenticate");
        } Array<Record<string, any>>
    }
    private async authenticateInternal(): Promise<void> {
        if (process.env.PWL_EMAIL === undefined || process.env.PWL_PASS === undefined) {
            throw new Error("PWL_EMAIL or PWL_PASS not set");
        }
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        this.logger.debug("Navigating to login page");
        await page.goto(getLoginPage());

        this.logger.debug("Waiting for login page to load")
        await page.waitForSelector('input[placeholder="Email"]');

        this.logger.debug("Logging in");
        await page.type('input[placeholder="Email"]', process.env.PWL_EMAIL);
        await page.type('input[placeholder="Password"]', process.env.PWL_PASS + String.fromCharCode(13));
        try {
            await page.waitForNavigation();
        } catch (e) {
            this.logger.warn("Timeout failed, trying to get JWT token from local storage");
        }
        this.logger.debug("Getting JWT token from local storage");

        // Fetch JWT token from local storage
        const loginStorage = await page.evaluate(() => {
            // @ts-ignore
            return window.localStorage.getItem("login");
        });
        await browser.close();

        if (loginStorage === null) {
            throw new Error("Login failed - Incorrect E-Mail or Password");
        }
        const login = JSON.parse(loginStorage);
        const jwt = login.jwt;
        if (jwt === undefined) {
            throw new Error("JWT not found");
        }
        this.jwtToken = jwt;
    }
    private async waitForAuthentication(): Promise<void> {
        if (this.jwtToken === null) {
            if (this.authState != "authenticating") {
                this.authenticate();
            }
            this.logger.info("Waiting for authentication");
            while (this.authState === "authenticating") {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            if (this.authState === "failed") {
                throw new Error("Failed to authenticate");
            }
        }
    }
    public async getWeatherData(deviceId: string): Promise<WeatherData> {
        this.logger.info("Requesting weather data");
        const date = new Date();
        if (date.getHours() < 6) {
            const weatherData = this.createEmptyWeatherObject(weatherDataAdapter) as WeatherData;
            weatherData.timestamp = new Date();
            return weatherData;
        }
        const weatherCSV = await retryWrapper((async () => {
            await this.waitForAuthentication();
            return await this.requestWeather(deviceId);
        }).bind(this), 3);
        this.logger.info("Weather data received");
        this.logger.info("Parsing weather data");
        const weatherTable = await this.parseCSV(weatherCSV);
        const weatherData = this.createWeatherObject(weatherTable, weatherDataAdapter) as WeatherData;
        this.logger.info("Weather data parsed");
        return weatherData;
    }
    public async getDiscoveryData(deviceId: string): Promise<Array<DiscoveryDevice>> {
        this.logger.info("Requesting discovery data");
        const weatherCSV = await retryWrapper((async () => {
            await this.waitForAuthentication();
            return await this.requestWeather(deviceId);
        }).bind(this), 3);
        this.logger.info("Discovery data received");
        this.logger.info("Parsing discovery data");
        const weatherTable = await this.parseCSV(weatherCSV);
        const discoveryData = this.createHADiscoveryData(weatherTable[0], weatherDataAdapter, "");
        this.logger.info("Discovery data parsed");
        return discoveryData;
    }
    private createHADiscoveryData(csvData: Array<string>, adapter: Record<string, any> | Array<Record<string, any>>, keys: string): Array<DiscoveryDevice> {
        if (keys[0] === ".") {
            keys = keys.slice(1);
        }
        if (Array.isArray(adapter)) {
            return adapter.map((adapter, index) => {
                return this.createHADiscoveryData(csvData, adapter, `${keys}[${index}]`);
            }).flat();
        }
        if (typeof adapter === "object") {
            if (adapter.columnId !== undefined) {
                const unit = adapter.convertUnit(csvData[adapter.columnId]);
                if (unit === false) {
                    return [];
                }
                return [{
                    name: adapter.name,
                    unique_id: `${process.env.PWL_DEVICE_ID}_${keys.replace(/\./g, "_").replace(/\[|\]/g, "")}`,
                    state_topic: `pwl/${process.env.PWL_DEVICE_ID}/state`,
                    value_template: `{{ value_json.${keys} }}`,
                    unit_of_measurement: unit,
                    device: deviceObj,
                    device_class: adapter.device_class || "None",
                    expire_after: 600
                }]
            } else {
                return Object.entries(adapter).map(([key, value]) => {
                    return this.createHADiscoveryData(csvData, value, `${keys}.${key}`);
                }).flat();
            }
        } else {
            return [];
        }
    }
    private async requestWeather(deviceId: string): Promise<string> {
        if (this.jwtToken === null) {
            throw new Error("JWT token not set");
        }
        this.logger.debug("Generating export URL")
        const url = generateExportURL(deviceId, this.jwtToken);
        this.logger.debug(`Requesting weather data from ${url.toString()}`);
        const response = await fetch(url.toString());
        if (!response.ok) {
            this.jwtToken = null;
            const error = await response.text();
            let errorMessage = "";
            try {
                errorMessage = JSON.parse(error).message;
            } catch (e) {
                errorMessage = error;
            }
            throw new Error(`Failed to get weather data: ${errorMessage}`);
        }
        return response.text()
    }
    private async parseCSV(weatherData: string): Promise<any[][]> {
        this.logger.debug("Parsing weather CSV");
        const lines = weatherData.split("\n");
        const csvParser = parse({
            delimiter: ',',
            quote: '"',
            relax_quotes: true,
            cast: true
        });
        let result: Array<Array<any>> = [];
        csvParser.on('readable', function () {
            let record;
            while (record = csvParser.read()) {
                result.push(record);
            }
        });
        csvParser.write(lines[1] + "\n");
        csvParser.write(lines[lines.length - 1] + "\n");
        csvParser.end();
        this.logger.debug("Weather CSV parsed");
        return result;
    }

    private createWeatherObject(csvData: Array<Array<string>>, adapter: Record<string, any> | Array<Record<string, any>>): Record<string, any> | any {
        if (Array.isArray(adapter)) {
            return adapter.map((adapter) => {
                return this.createWeatherObject(csvData, adapter);
            });
        }
        if (typeof adapter === "object") {
            if (adapter.columnId !== undefined) {
                return adapter.convertValue(csvData[csvData.length - 1][adapter.columnId], csvData[0][adapter.columnId]);
            } else {
                return Object.entries(adapter).reduce((acc, [key, value]) => {
                    return { ...acc, [key]: this.createWeatherObject(csvData, value) };
                }, {});
            }
        } else {
            return {};
        }
    }

    private createEmptyWeatherObject(adapter: Record<string, any> | Array<Record<string, any>>): Record<string, any> | any {
        if (Array.isArray(adapter)) {
            return adapter.map((adapter) => {
                return this.createEmptyWeatherObject(adapter);
            });
        }
        if (typeof adapter === "object") {
            if (adapter.columnId !== undefined) {
                return "null";
            } else {
                return Object.entries(adapter).reduce((acc, [key, value]) => {
                    return { ...acc, [key]: this.createEmptyWeatherObject(value) };
                }, {});
            }
        } else {
            return "null";
        }
    }

}