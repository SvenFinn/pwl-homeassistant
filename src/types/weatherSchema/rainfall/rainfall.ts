import { RainSchema } from './rain/rain';

export type RainfallSchema<IntType, FloatType> = {
    rain: RainSchema<IntType, FloatType>,
}