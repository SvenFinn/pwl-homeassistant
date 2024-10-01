export function defaultConvertValueFloat(value: string, unit: string): number | "null" {
    if (isNaN(Number(value))) {
        return "null";
    }
    return Number(value);
}

export function defaultConvertValueInt(value: string, unit: string): number | "null" {
    if (isNaN(Number(value))) {
        return "null";
    }
    return Math.round(Number(value));
}

export function defaultConvertUnit(unit: string | undefined): string | null | false {
    if (unit === undefined || unit == "") {
        return false;
    }

    if (unit == "**") {
        return null;
    }
    return unit;
}

export function convertUnitTemperature(unit: string): string | null | false {
    if (unit === "°F") {
        return "°C"
    }
    return defaultConvertUnit(unit)
}

export function convertValueTemperature(value: string, unit: string): number | "null" {
    const valueFloat = defaultConvertValueFloat(value, unit);
    if (valueFloat === "null") return "null";
    if (unit === "°F") {
        return Math.round((valueFloat - 32) * 5 / 9);
    }
    return valueFloat;
}