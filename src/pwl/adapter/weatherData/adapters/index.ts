import { AdapterSchema } from "../types/types";
import { timeStampAdapter } from "./timestamp";
import { temperatureAdapter } from "./temperature/temperature";
import { windAdapter } from "./wind/wind";
import { pressureAdapter } from "./pressure/pressure";
import { luminosityAdapter } from "./luminosity/luminosity";
import { rainfallAdapter } from "./rainfall/rainfall";

export const weatherDataAdapter: AdapterSchema = {
    timestamp: timeStampAdapter,
    temperature: temperatureAdapter,
    wind: windAdapter,
    pressure: pressureAdapter,
    luminosity: luminosityAdapter,
    rainfall: rainfallAdapter
}