import { AdapterSchema } from "../../types/types";
import { defaultConvertUnit, defaultConvertValueInt } from "../defaultConvert";

const absolutePressureAdapter: AdapterSchema["pressure"]["absolute"] = {
    columnId: 1,
    name: "Druck (absolut)",
    device_class: "atmospheric_pressure",
    convertUnit: defaultConvertUnit,
    convertValue: defaultConvertValueInt
}

const relativePressureAdapter: AdapterSchema["pressure"]["relative"] = {
    columnId: 2,
    name: "Druck (relativ)",
    device_class: "atmospheric_pressure",
    convertUnit: defaultConvertUnit,
    convertValue: defaultConvertValueInt
}

export const pressureAdapter: AdapterSchema["pressure"] = {
    absolute: absolutePressureAdapter,
    relative: relativePressureAdapter
}