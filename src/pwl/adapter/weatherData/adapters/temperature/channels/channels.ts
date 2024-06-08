import { AdapterSchema } from "../../../types/types";
import { defaultConvertValueInt, defaultConvertUnit, convertValueTemperature, convertUnitTemperature } from "../../defaultConvert";
import { config } from "dotenv";
config();

export const channelsTemperatureAdapter: AdapterSchema["temperature"]["channels"] = [
    createChannelAdapter(20,34, process.env.CHANNEL_NAME_1 || "Channel 1"),
    createChannelAdapter(22, 35, process.env.CHANNEL_NAME_2 || "Channel 2"),
    createChannelAdapter(24, 36, process.env.CHANNEL_NAME_3 || "Channel 3"),
    createChannelAdapter(26, 37, process.env.CHANNEL_NAME_4 || "Channel 4"),
    createChannelAdapter(28, 38, process.env.CHANNEL_NAME_5 || "Channel 5"),
    createChannelAdapter(30, 39, process.env.CHANNEL_NAME_6 || "Channel 6"),
    createChannelAdapter(32, 40, process.env.CHANNEL_NAME_7 || "Channel 7"),
]

function createChannelAdapter(temperatureIndex: number, waterLeakageIndex: number, name: string): AdapterSchema["temperature"]["channels"][0] {
    return {
        temperature: {
            columnId: temperatureIndex,
            name: `${name} Temperature`,
            device_class: "temperature",
            convertValue: convertValueTemperature,
            convertUnit: convertUnitTemperature
        },
        humidity: {
            columnId: temperatureIndex + 1,
            name: `${name} Humidity`,
            device_class: "humidity",
            convertValue: defaultConvertValueInt,
            convertUnit: defaultConvertUnit
        },
        waterLeakage: {
            columnId: waterLeakageIndex,
            name: `${name} Water Leakage`,
            device_class: "water",
            convertValue: defaultConvertValueInt,
            convertUnit: defaultConvertUnit
        }
    }

}