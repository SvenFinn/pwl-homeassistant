import { IndoorTemperatureSchema } from './indoor/indoor';
import { OutdoorTemperatureSchema } from './outdoor/outdoor';
import { ChannelsTemperatureSchema } from './channels/channels';

export type TemperatureSchema<IntType, FloatType> = {
    indoor: IndoorTemperatureSchema<IntType, FloatType>,
    outdoor: OutdoorTemperatureSchema<IntType, FloatType>,
    channels: ChannelsTemperatureSchema<IntType, FloatType>,
}