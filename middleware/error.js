"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMiddleware = void 0;
var ErrorHandler_1 = require("../utils/ErrorHandler");
var ErrorMiddleware = function (err, req, res, next) {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";
    // Wrong mongodb id error
    if (err.name === "CastError") {
        var message = "Resource not found. Invalid : ".concat(err.path);
        err = new ErrorHandler_1.default(message, 400);
    }
    // Duplicate key error
    if (err.code === 11000) {
        var message = "Duplicate : ".concat(Object.keys(err.keyValue), " entered");
        err = new ErrorHandler_1.default(message, 400);
    }
    //Wrong JWT error
    if (err.name === "JsonWebTokenError") {
        var message = "Json Web Token is invalid, try again";
        err = new ErrorHandler_1.default(message, 400);
    }
    if (err.name === "TokenExpiredError") {
        var message = "Json Web Token is expired, try again";
        err = new ErrorHandler_1.default(message, 400);
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
exports.ErrorMiddleware = ErrorMiddleware;
