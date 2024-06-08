import { AdapterSchema } from "../../types/types";
import { channelsTemperatureAdapter } from "./channels/channels";
import { indoorTemperatureAdapter } from "./indoor/indoor";
import { outdoorTemperatureAdapter } from "./outdoor/outdoor";
import {defaultConvertUnit, defaultConvertValueFloat, defaultConvertValueInt} from "../defaultConvert";

export const temperatureAdapter: AdapterSchema["temperature"] = {
    channels: channelsTemperatureAdapter,
    indoor: indoorTemperatureAdapter,
    outdoor: outdoorTemperatureAdapter
}