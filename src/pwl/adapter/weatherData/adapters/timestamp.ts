import { DateAdapter } from "../types/types";

export const timeStampAdapter: DateAdapter = {
    columnId: 0,
    name: "Letztes Update",
    device_class: "timestamp",
    convertValue: (value: string, unit: string) => {
        const dateString = value.split(" ").slice(0, -1).join(" ");
        const date = new Date(dateString);
        return date;
    },
    convertUnit: (unit: string) => null
}
