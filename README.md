# PWL HomeAssistant

Project to connect a ProWeatherLive weather station to Home Assistant using the MQTT protocol.

## Setup

You can find the current docker image in the packages section of this repository.
To run the docker container, download the [docker-compose.yaml](docker-compose.yaml) file and modify the environment variables to match your setup.

The following environment variables are available:

| Variable                  | Description                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------- |
| `MQTT_USER`               | The username for the MQTT broker.                                                     |
| `MQTT_PASS`               | The password for the MQTT broker.                                                     |
| `MQTT_HOST`               | The hostname of the MQTT broker.                                                      |
| `MQTT_DISCOVERY`          | Enable or disable MQTT discovery broadcasting.                                        |
| `PWL_DEVICE_ID`           | The device id of the ProWeatherLive weather station.<sup>1</sup>                      |
| `PWL_DEVICE_NAME`         | The name of the ProWeatherLive weather station. Only used for MQTT discovery.         |
| `PWL_DEVICE_MODEL`        | The model of the ProWeatherLive weather station. Only used for MQTT discovery.        |
| `PWL_DEVICE_MANUFACTURER` | The manufacturer of the ProWeatherLive weather station. Only used for MQTT discovery. |
| `PWL_EMAIL`               | The email address of the ProWeatherLive account.<sup>2</sup>                          |
| `PWL_PASS`                | The password of the ProWeatherLive account.<sup>2</sup>                               |
| `LOG_LEVEL`               | The log level of the application.                                                     |
| `CHANNEL_NAME_1`          | The name of the first channel. (default: "Channel 1")                                 |
| `CHANNEL_NAME_2`          | The name of the second channel. (default: "Channel 2")                                |
| `CHANNEL_NAME_3`          | The name of the third channel. (default: "Channel 3")                                 |
| `CHANNEL_NAME_4`          | The name of the fourth channel. (default: "Channel 4")                                |
| `CHANNEL_NAME_5`          | The name of the fifth channel. (default: "Channel 5")                                 |
| `CHANNEL_NAME_6`          | The name of the sixth channel. (default: "Channel 6")                                 |
| `CHANNEL_NAME_7`          | The name of the seventh channel. (default: "Channel 7")                               |
| `TZ`                      | The timezone of the application.                                                      |

<sup>1</sup> Refer to [Getting the device id](#getting-the-device-id) for more information.

<sup>2</sup> Neither the email address nor the password are encrypted in the docker container. Use at your own risk.

### Getting the device id

To get the device id of your ProWeatherLive weather station, you need to log in to the ProWeatherLive website, then navigate to the "Data Export" section. There, using the "Export Data" button, download the CSV export of your weather station. The device Id can be extracted from the URL, where the csv is downloaded from. The URL should look like this:

```http
https://proweatherlive.net/api/weatherMetrics/export?device=<DEVICE_ID>&startTime=2024-08-12T22%3A00%3A00.000Z&endTime=2024-08-13T21%3A59%3A59.999Z&format=csv&units%5B0%5D%5Btype%5D=direction&units%5B0%5D%5Bunit%5D=m&units%5B1%5D%5Btype%5D=distance&units%5B1%5D%5Bunit%5D=km&units%5B2%5D%5Btype%5D=temperature&units%5B2%5D%5Bunit%5D=%C2%B0C&units%5B3%5D%5Btype%5D=baroPressure&units%5B3%5D%5Bunit%5D=hPa&units%5B4%5D%5Btype%5D=windSpeed&units%5B4%5D%5Bunit%5D=km%2Fh&units%5B5%5D%5Btype%5D=windDirection&units%5B5%5D%5Bunit%5D=16%20Pts&units%5B6%5D%5Btype%5D=rain&units%5B6%5D%5Bunit%5D=mm&units%5B7%5D%5Btype%5D=lightIntensity&units%5B7%5D%5Bunit%5D=Lux&units%5B8%5D%5Btype%5D=hcho&units%5B8%5D%5Bunit%5D=ppb&units%5B9%5D%5Btype%5D=coco2&units%5B9%5D%5Bunit%5D=ppm&%24accessToken=******************&locale=en
```

The device id is the value of the `device` parameter in the URL.

## MQTT Discovery

The application supports MQTT discovery. If enabled, the application will broadcast the weather station's sensors to the MQTT broker. The sensors will be automatically added to Home Assistant. The device name, model, and manufacturer can be set using the `PWL_DEVICE_NAME`, `PWL_DEVICE_MODEL`, and `PWL_DEVICE_MANUFACTURER` environment variables.

## How it works

The application connects to the ProWeatherLive services using the login form, logging in with the provided email and password. After a successful login, the application fetches the susers JWT token, s it is used in the $accessToken parameter in the CSV export URL.
Afterwards, the application fetches the CSV export of the weather station and parses the data regularly. The parsed data is then published to the MQTT broker.

The data is published every 5 minutes, as ProWeatherLive only exports data in 5-minute intervals. Additionally, data is only available between 6:00am to midnight by ProWeatherLive. During this time, the application will broadcast "unavailable" for the sensors.

Sensors channels not used by the weather station (Channel 1-7) will be broadcast as "unavailable" as well.
