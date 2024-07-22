"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = exports.refreshTokenOptions = exports.accessTokenOptions = void 0;
require("dotenv").config();
const redis_1 = require("./redis");
//pass environment variable to integrate with fallback values
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '300', 10);
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '1200', 10);
exports.accessTokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 1000 * 60),
    maxAge: accessTokenExpire * 1000 * 60,
    httpOnly: true,
    sameSite: 'none',
    secure: true
};
exports.refreshTokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 1000 * 60 * 60 * 24),
    maxAge: refreshTokenExpire * 1000 * 60 * 60 * 24,
    httpOnly: true,
    sameSite: 'none',
    secure: true
};
const sendToken = async (user, statusCode, res) => {
    const accessToken = await user.SignAccessToken();
    const refreshToken = await user.SignRefreshToken();
    //upload session to redis
    redis_1.redis.set(user._id, JSON.stringify(user));
    // only set secure in production
    if (process.env.NODE_ENV === "production") {
        exports.accessTokenOptions.secure = true;
    }
    res.cookie("access_token", accessToken, exports.accessTokenOptions);
    res.cookie("refresh_token", refreshToken, exports.refreshTokenOptions);
    res.status(statusCode).json({
        success: true,
        user,
        accessToken,
    });
};
exports.sendToken = sendToken;
