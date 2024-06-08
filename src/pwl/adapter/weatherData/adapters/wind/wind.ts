import { AdapterSchema } from "../../types/types";
import { defaultConvertUnit, defaultConvertValueFloat, defaultConvertValueInt } from "../defaultConvert";

const windDirectionAdapter: AdapterSchema["wind"]["direction"] = {
    columnId: 11,
    name: "Windrichtung",
    device_class: "wind_speed",
    convertValue(value, unit) {
        if(unit === "deg"){
            return defaultConvertValueInt(value, unit);
        } else if(unit === "rad"){
            return Math.round(Number(value) * 180 / Math.PI); 
        } else {
            throw new Error(`Invalid unit for wind direction: ${unit}`);
        }
    },
    convertUnit(unit) {
        return "deg";
    }
}

function windSpeedConvertValue(value: string, unit: string): number | "null"{
    if(unit === "km/h"){
        return defaultConvertValueFloat(value, unit);
    } else if(unit === "m/s"){
        return Math.round(Number(value) * 3.6);
    } else {
        throw new Error("Invalid unit for wind speed");
    }
}


const windSpeedAdapter: AdapterSchema["wind"]["speed"] = {
    columnId: 12,
    name: "Windgeschwindigkeit", 
    device_class: "wind_speed",
    convertUnit: defaultConvertUnit,
    convertValue: windSpeedConvertValue
}

const windAvgSpeedAdapter: AdapterSchema["wind"]["avgSpeed"] = {
    columnId: 13,
    name: "Windgeschwindigkeit (Durchschnitt)",
    device_class: "wind_speed",
    convertUnit: defaultConvertUnit,
    convertValue: windSpeedConvertValue
}

const windGustSpeedAdapter: AdapterSchema["wind"]["gustSpeed"] = {
    columnId: 14,
    name: "Windböen",
    device_class: "wind_speed",
    convertUnit: defaultConvertUnit,
    convertValue: windSpeedConvertValue
}

export const windAdapter: AdapterSchema["wind"] = {
    direction: windDirectionAdapter,
    speed: windSpeedAdapter,
    avgSpeed: windAvgSpeedAdapter,
    gustSpeed: windGustSpeedAdapter
}

