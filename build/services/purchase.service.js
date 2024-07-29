"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPurchases = exports.newpurchase = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const purchase_model_1 = __importDefault(require("../models/purchase.model"));
exports.newpurchase = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(async (data, res, next) => {
    try {
        const purchase = await purchase_model_1.default.create(data);
        res.status(201).json({
            success: true,
            purchase: purchase,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 404));
    }
});
//get all orders 
const getPurchases = async (res) => {
    const purchases = await purchase_model_1.default.find().sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        purchases,
    });
};
exports.getPurchases = getPurchases;
