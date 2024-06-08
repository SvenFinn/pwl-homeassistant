import { AdapterSchema } from "../../types/types";
import { defaultConvertUnit, defaultConvertValueInt } from "../defaultConvert";

const intensityAdapter: AdapterSchema["luminosity"]["intensity"] = {
    columnId: 19,
    name: "Light Intensity",
    device_class: "illuminance",
    convertUnit: defaultConvertUnit,
    convertValue: defaultConvertValueInt
}

const uvIndexAdapter: AdapterSchema["luminosity"]["uvIndex"] = {
    columnId: 18,
    name: "UV Index",
    device_class: "illuminance",
    convertUnit: defaultConvertUnit,
    convertValue: defaultConvertValueInt
}

export const luminosityAdapter: AdapterSchema["luminosity"] = {
    intensity: intensityAdapter,
    uvIndex: uvIndexAdapter
}