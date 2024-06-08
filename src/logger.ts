import pino from 'pino';
import "dotenv/config";

export const logger = pino({
    name: "proweatherlive",
    level: process.env.LOG_LEVEL || "info",
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
        }
    }
});
