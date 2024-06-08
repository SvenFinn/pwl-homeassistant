import { networkInterfaces } from "os";
import { DiscoveryDevice } from "../types/discovery/device";

export const deviceObj: DiscoveryDevice["device"] = {
    identifiers: process.env.PWL_DEVICE_ID || "PWL",
    manufacturer: process.env.PWL_DEVICE_MANUFACTURER || "PWL",
    model: process.env.PWL_DEVICE_MODEL || "PWL",
    name: process.env.PWL_DEVICE_NAME || "PWL",

}