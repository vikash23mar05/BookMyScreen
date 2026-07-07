import Redis from "ioredis";
import { config } from "./config";

class InMemoryRedis {
    private store = new Map<string, any>();
    private ttls = new Map<string, NodeJS.Timeout>();

    async get(key: string): Promise<string | null> {
        const val = this.store.get(key);
        return typeof val === 'string' ? val : null;
    }

    async setex(key: string, seconds: number, value: string): Promise<string> {
        this.store.set(key, value);
        if (this.ttls.has(key)) {
            clearTimeout(this.ttls.get(key)!);
        }
        const timeout = setTimeout(() => {
            this.store.delete(key);
            this.ttls.delete(key);
        }, seconds * 1000);
        this.ttls.set(key, timeout);
        return "OK";
    }

    async del(key: string): Promise<number> {
        if (this.ttls.has(key)) {
            clearTimeout(this.ttls.get(key)!);
            this.ttls.delete(key);
        }
        const existed = this.store.delete(key);
        return existed ? 1 : 0;
    }

    async exists(key: string): Promise<number> {
        return this.store.has(key) ? 1 : 0;
    }

    async smembers(key: string): Promise<string[]> {
        const val = this.store.get(key);
        if (val instanceof Set) {
            return Array.from(val);
        }
        return [];
    }

    async sadd(key: string, member: string): Promise<number> {
        let val = this.store.get(key);
        if (!(val instanceof Set)) {
            val = new Set<string>();
            this.store.set(key, val);
        }
        const sizeBefore = val.size;
        val.add(member);
        return val.size > sizeBefore ? 1 : 0;
    }

    async srem(key: string, member: string): Promise<number> {
        const val = this.store.get(key);
        if (val instanceof Set) {
            const deleted = val.delete(member);
            return deleted ? 1 : 0;
        }
        return 0;
    }
}

let redis: any;

const useInMemory = process.env.USE_IN_MEMORY_REDIS === "true" || !process.env.REDIS_HOST;

if (useInMemory) {
    console.log("[Redis] Using in-memory fallback client.");
    redis = new InMemoryRedis();
} else {
    redis = new Redis({
        host: config.redisHost,
        port: config.redisPort,
        retryStrategy: () => 5000
    });

    redis.on("error", (err: any) => {
        console.error("[Redis error:]", err);
    });

    redis.on("connect", () => {
        console.log("[Redis] Connected successfully.");
    });
}

export default redis;

