import { AdapterSchema } from "../../types/types";
import { defaultConvertUnit, defaultConvertValueFloat } from "../defaultConvert";

const dailyRainAdapter: AdapterSchema["rainfall"]["rain"]["daily"] = {
    columnId: 17,
    name: "Regenmenge (Tag)",
    device_class: "water",
    convertUnit: defaultConvertUnit, 
    convertValue: defaultConvertValueFloat
}

const hourlyRainAdapter: AdapterSchema["rainfall"]["rain"]["hourly"] = {
    columnId: 16,
    name: "Regenmenge (Stunde)",
    device_class: "water",
    convertUnit: defaultConvertUnit,
    convertValue: defaultConvertValueFloat
}

const rainRateAdapter: AdapterSchema["rainfall"]["rain"]["rate"] = {
    columnId: 15,
    name: "Regenrate",
    device_class: "water",
    convertUnit: (unit: string) => {
        if(unit === "mm"){
            return "mm/h";
        } else {
            return defaultConvertUnit(unit);
        }
    },
    convertValue: defaultConvertValueFloat
}

export const rainfallAdapter: AdapterSchema["rainfall"] = {
    rain: {
        daily: dailyRainAdapter,
        hourly: hourlyRainAdapter,
        rate: rainRateAdapter
    }
}