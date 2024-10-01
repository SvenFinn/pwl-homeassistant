import { AdapterSchema } from "../../../types/types";
import { defaultConvertUnit, defaultConvertValueInt, convertValueTemperature, convertUnitTemperature } from "../../defaultConvert";

const indoorTTemperatureAdapter: AdapterSchema["temperature"]["indoor"]["temperature"] = {
    columnId: 3,
    name: "Temperatur (innen)",
    device_class: "temperature",
    convertUnit: convertUnitTemperature,
    convertValue: convertValueTemperature
}

const indoorHumidityAdapter: AdapterSchema["temperature"]["indoor"]["humidity"] = {
    columnId: 4,
    name: "Luftfeuchtigkeit (innen)",
    device_class: "humidity",
    convertUnit: defaultConvertUnit,
    convertValue: defaultConvertValueInt
}


export const indoorTemperatureAdapter: AdapterSchema["temperature"]["indoor"] = {
    humidity: indoorHumidityAdapter,
    temperature: indoorTTemperatureAdapter
}