import { LuminositySchema } from "./luminosity/luminosity"
import { PressureSchema } from "./pressure/pressure"
import { RainfallSchema } from "./rainfall/rainfall"
import { TemperatureSchema } from "./temperature/temperature"
import { WindSchema } from "./wind/wind"

export type WeatherSchema<IntType, FloatType, DateType> = {
    timestamp: DateType,
    temperature: TemperatureSchema<IntType, FloatType>,
    pressure: PressureSchema<IntType, FloatType>,
    luminosity: LuminositySchema<IntType, FloatType>,
    rainfall: RainfallSchema<IntType, FloatType>,
    wind: WindSchema<IntType, FloatType>,
}