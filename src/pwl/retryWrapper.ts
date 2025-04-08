import { logger } from "../logger";

export async function retryWrapper(fn: Function, retries: number, ...args: any[]) {
    let tries = 0;
    while (tries < retries) {
        try {
            return await fn(...args);
        } catch (e) {
            logger.warn(e.message);
            tries++;
        }
    }
    throw new Error("Failed to execute function after " + retries + " retries");
}