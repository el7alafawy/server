"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = exports.createProduct = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const product_model_1 = __importDefault(require("../models/product.model"));
// create course
exports.createProduct = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(async (data, res) => {
    const product = await product_model_1.default.create(data);
    res.status(201).json({
        success: true,
        product,
    });
});
//get all users 
const getProducts = async (res) => {
    const products = await product_model_1.default.find().sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        products,
    });
};
exports.getProducts = getProducts;
