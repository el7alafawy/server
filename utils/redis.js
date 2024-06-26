"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
var ioredis_1 = require("ioredis");
require("dotenv").config();
var redisClient = function () {
    if (process.env.UPSTASH_REDIS_REST_URL) {
        console.log("Redis connected");
        return process.env.UPSTASH_REDIS_REST_URL;
    }
    throw new Error("Redis connection failed");
};
exports.redis = new ioredis_1.Redis(redisClient());
