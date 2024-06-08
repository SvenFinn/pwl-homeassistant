import { WeatherData, WeatherUnits } from "../../../../types/weatherData"
import { WeatherSchema } from "../../../../types/weatherSchema/weatherSchema"

export type AdapterSchema = WeatherSchema<Adapter, Adapter, DateAdapter>

export type Adapter = {
    columnId: number, // Column index in the CSV file
    name: string, // Name of the resulting entity in home assistant
    device_class: HADeviceClass | undefined
    convertValue: (value: string, unit: string) => number | "null",
    convertUnit: (unit: string) => string | null | false
}

export type DateAdapter = Omit<Adapter, 'convertValue'> & {
    convertValue: (value: string, unit: string) => Date
}

export type AdapterResult = {
    units: WeatherUnits,
    data: WeatherData
}

export type HADeviceClass = "None" | "apparent_power" | "aqi" | "atmospheric_pressure" | "battery" | "carbon_dioxide" | "carbon_monoxide" | "current" | "data_rate" | "data_size" | "date" | "distance" | "duration" | "energy" | "energy_storage" | "enum" | "frequency" | "gas" | "humidity" | "illuminance" | "irradiance" | "moisture" | "monetary" | "nitrogen_dioxide" | "nitrogen_monoxide" | "nitrous_oxide" | "ozone" | "ph" | "pm1" | "pm25" | "pm10" | "power_factor" | "power" | "precipitation" | "precipitation_intensity" | "pressure" | "reactive_power" | "signal_strength" | "sound_pressure" | "speed" | "sulphur_dioxide" | "temperature" | "timestamp" | "volatile_organic_compounds" | "volatile_organic_compounds_parts" | "voltage" | "volume" | "volume_flow_rate" | "volume_storage" | "water" | "weight" | "wind_speed"