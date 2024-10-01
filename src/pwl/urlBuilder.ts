export function getLoginPage() {
    return "https://proweatherlive.net/login";
}

export function generateExportURL(deviceId: string, jwtToken: string): URL {
    const baseURL = "https://proweatherlive.net/api/weatherMetrics/export";
    const urlObj = new URL(baseURL);

    const currentTimeUTC = new Date(new Date().toUTCString());
    const startTime = new Date(currentTimeUTC);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date();
    endTime.setHours(23, 59, 59, 999);

    urlObj.searchParams.append("format", "csv");
    urlObj.searchParams.append("locale", "en");
    urlObj.searchParams.append("startTime", startTime.toISOString());
    urlObj.searchParams.append("endTime", endTime.toISOString());
    urlObj.searchParams.append("device", deviceId);
    urlObj.searchParams.append("$accessToken", jwtToken);

    return urlObj;
}
