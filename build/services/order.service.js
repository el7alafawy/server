"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrders = exports.newOrder = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const order_model_1 = __importDefault(require("../models/order.model"));
exports.newOrder = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(async (data, res, next) => {
    try {
        const order = await order_model_1.default.create(data);
        res.status(201).json({
            success: true,
            order: order,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 404));
    }
});
//get all orders 
const getOrders = async (res) => {
    const orders = await order_model_1.default.find().sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        orders,
    });
};
exports.getOrders = getOrders;
