import { PwlClient } from "./pwl/pwl";
import { PwlMqttClient } from "./mqtt";
import { logger } from "./logger";

let firstRun = true;

require("dotenv").config()

const pwlClient = new PwlClient();
const mqttClient = new PwlMqttClient();
main();


async function main(){
    if(!process.env.PWL_DEVICE_ID){
        throw new Error("PWL_DEVICE_ID not set");
    }
    logger.info("Refreshing weather data");
    if(firstRun){
        const discoveryData = await pwlClient.getDiscoveryData(process.env.PWL_DEVICE_ID);
        mqttClient.publishDiscovery(discoveryData);
        firstRun = false
    }
    const weatherData = await pwlClient.getWeatherData(process.env.PWL_DEVICE_ID);
    mqttClient.publishWeatherData(weatherData);
    const sleepOffset = 300000 - ( Date.now()-weatherData.timestamp.getTime()); // 5 minutes - time since last data = time to sleep
    logger.info(`Sleeping for ${(sleepOffset+60000)/1000}s`);
    setTimeout(main, sleepOffset + 60000);
}
