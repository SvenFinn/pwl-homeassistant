import { AdapterSchema } from "../../../types/types";
import { defaultConvertUnit, defaultConvertValueInt, convertValueTemperature, convertUnitTemperature } from "../../defaultConvert";

const outdoorTTemperatureAdapter: AdapterSchema["temperature"]["outdoor"]["temperature"] = {
    columnId: 5,
    name: "Temperatur (außen)",
    device_class: "temperature",
    convertUnit: convertUnitTemperature,
    convertValue: convertValueTemperature
}

const outdoorHumidityAdapter: AdapterSchema["temperature"]["outdoor"]["humidity"] = {
    columnId: 6,
    name: "Luftfeuchtigkeit (außen)",
    device_class: "humidity",
    convertUnit: defaultConvertUnit,
    convertValue: defaultConvertValueInt
}

const outdoorDewPointAdapter: AdapterSchema["temperature"]["outdoor"]["dewPoint"] = {
    columnId: 7,
    name: "Taupunkt",
    device_class: "temperature",
    convertUnit: convertUnitTemperature,
    convertValue: convertValueTemperature
}

const outdoorHeatIndexAdapter: AdapterSchema["temperature"]["outdoor"]["heatIndex"] = {
    columnId: 8,
    name: "Hitzeindex",
    device_class: "temperature",
    convertUnit: convertUnitTemperature,
    convertValue: convertValueTemperature
}

const outdoorWindChillAdapter: AdapterSchema["temperature"]["outdoor"]["windChill"] = {
    columnId: 9,
    name: "Windchill",
    device_class: "temperature",
    convertUnit: convertUnitTemperature,
    convertValue: convertValueTemperature
}

const outdoorFeelsLikeAdapter: AdapterSchema["temperature"]["outdoor"]["feelsLike"] = {
    columnId: 10,
    name: "Gefühlte Temperatur",
    device_class: "temperature",
    convertUnit: convertUnitTemperature,
    convertValue: convertValueTemperature
}

export const outdoorTemperatureAdapter: AdapterSchema["temperature"]["outdoor"] = {
    humidity: outdoorHumidityAdapter,
    temperature: outdoorTTemperatureAdapter,
    dewPoint: outdoorDewPointAdapter,
    feelsLike: outdoorFeelsLikeAdapter,
    heatIndex: outdoorHeatIndexAdapter,
    windChill: outdoorWindChillAdapter
}