import { WeatherSchema } from "./weatherSchema/weatherSchema";

export type WeatherData = WeatherSchema<number | "null", number | "null", Date>
export type WeatherUnits = WeatherSchema<string | null, string | null, null>
export type WeatherNames = WeatherSchema<string, string, string>