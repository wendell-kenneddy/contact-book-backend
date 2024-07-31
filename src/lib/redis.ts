import IORedis from "ioredis";
import { env } from "./env";

const redis = new IORedis({ port: env.REDIS_PORT, host: env.REDIS_HOST });

export { redis };
