export type ChannelsTemperatureSchema<IntType, FloatType> = Array<ChannelTemperatureSchema<IntType, FloatType>>;

export type ChannelTemperatureSchema<IntType, FloatType> = {
    temperature: FloatType,
    humidity: IntType,
    waterLeakage: IntType,
}