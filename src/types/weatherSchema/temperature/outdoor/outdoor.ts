export type OutdoorTemperatureSchema<IntType, FloatType> = {
    temperature: FloatType,
    humidity: IntType,
    dewPoint: FloatType,
    heatIndex: FloatType,
    feelsLike: FloatType,
    windChill: FloatType,
}