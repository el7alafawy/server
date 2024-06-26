"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatchAsyncMiddleware = void 0;
var CatchAsyncMiddleware = function (func) { return function (req, res, next) {
    Promise.resolve(func(req, res, next).catch(next));
}; };
exports.CatchAsyncMiddleware = CatchAsyncMiddleware;
