import mqtt from 'mqtt';
import "dotenv";
import { MqttClient } from 'mqtt';
import { WeatherData } from './types/weatherData';
import pino, { Logger } from 'pino';
import { DiscoveryDevice } from './types/discovery/device';

export class PwlMqttClient {
    private client: MqttClient;
    private logger: Logger;
    constructor() {
        this.logger = pino({
            level: (process.env.LOG_LEVEL || "info").toLowerCase(),
            name: "mqtt-client",
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                }
            }
        });
        this.client = mqtt.connect(`mqtt://${process.env.MQTT_HOST}`, { username: process.env.MQTT_USER, password: process.env.MQTT_PASS });
        this.client.on('connect', () => {
            this.logger.info("Connected to MQTT broker");
        });
    }
    public publishWeatherData(weatherData: WeatherData) {
        if (!this.client.connected) {
            this.logger.error("MQTT client not connected");
            return;
        }
        this.logger.debug("Publishing weather data");
        this.client.publish(`pwl/${process.env.PWL_DEVICE_ID}/state`, JSON.stringify(weatherData), { retain: true });
        this.logger.debug("Weather data published");
    }
    public publishDiscovery(discoveryData: Array<DiscoveryDevice>) {
        if (!this.client.connected) {
            this.logger.error("MQTT client not connected");
            return;
        }
        this.logger.debug("Publishing discovery data");
        discoveryData.forEach((data) => {
            if (process.env.MQTT_DISCOVERY === "false") {
                this.client.publish(`homeassistant/sensor/${data.unique_id}/config`, "", { retain: true });
                return;
            }
            this.client.publish(`homeassistant/sensor/${data.unique_id}/config`, JSON.stringify(data), { retain: true });
        });
        this.logger.debug("Home Assistant discovery data published");
    }

}
