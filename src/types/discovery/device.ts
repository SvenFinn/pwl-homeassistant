export type DiscoveryDevice = {
    name: string,
    state_topic: string,
    value_template: string,
    device_class: string,
    unit_of_measurement: string,
    unique_id: string,
    expire_after: number,
    device: {
        manufacturer: string,
        model: string,
        name: string,
        identifiers: string,
    }
}