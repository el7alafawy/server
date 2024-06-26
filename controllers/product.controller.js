"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.getProductAll = exports.AddReviewReply = exports.AddReview = exports.getProduct = exports.getAllProducts = exports.editProduct = exports.uploadProduct = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const product_model_1 = __importDefault(require("../models/product.model"));
const redis_1 = require("../utils/redis");
const notification_model_1 = __importDefault(require("../models/notification.model"));
const product_service_1 = require("../services/product.service");
// upload product
exports.uploadProduct = (0, catchAsyncErrors_1.CatchAsyncMiddleware)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        const images = data.images;
        if (thumbnail) {
            const myCloud = yield cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: "products",
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        if (images) {
            for (let i = 0; i < images.length; i++) {
                const myCloud = yield cloudinary_1.default.v2.uploader.upload(thumbnail, {
                    folder: "products",
                });
                images[i] = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            }
        }
        (0, product_service_1.createProduct)(data, res, next);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
//edit Product
exports.editProduct = (0, catchAsyncErrors_1.CatchAsyncMiddleware)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        const images = data.images;
        if (thumbnail) {
            yield cloudinary_1.default.v2.uploader.destroy(thumbnail.public_id);
            const myCloud = yield cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: "products",
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        if (images) {
            for (let i = 0; i < images.length; i++) {
                yield cloudinary_1.default.v2.uploader.destroy(thumbnail.public_id);
                const myCloud = yield cloudinary_1.default.v2.uploader.upload(thumbnail, {
                    folder: "products",
                });
                images[i] = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            }
        }
        const productId = req.params.id;
        const product = yield product_model_1.default.findByIdAndUpdate(productId, {
            $set: data,
        }, { new: true });
        res.status(201).json({
            success: true,
            product,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
//get all  products
exports.getAllProducts = (0, catchAsyncErrors_1.CatchAsyncMiddleware)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isCacheExist = yield redis_1.redis.get("allProducts");
        if (isCacheExist) {
            const products = JSON.parse(isCacheExist);
            res.status(200).json({
                success: true,
                products,
            });
        }
        else {
            const products = yield product_model_1.default.find();
            yield redis_1.redis.set("allProducts", JSON.stringify(products));
            res.status(200).json({
                success: true,
                products,
            });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
//get product
exports.getProduct = (0, catchAsyncErrors_1.CatchAsyncMiddleware)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id;
        const product = yield product_model_1.default.findById(productId);
        res.status(200).json({
            success: true,
            product,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.AddReview = (0, catchAsyncErrors_1.CatchAsyncMiddleware)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const productId = req.params.id;
        const product = yield product_model_1.default.findById(productId);
        const { review, rating } = req.body;
        //new Review
        const newReview = {
            user: req === null || req === void 0 ? void 0 : req.user,
            comment: review,
            rating,
        };
        //add review to product
        product === null || product === void 0 ? void 0 : product.reviews.push(newReview);
        let avg = 0;
        product === null || product === void 0 ? void 0 : product.reviews.forEach((review) => {
            avg += review.rating;
        });
        if (product)
            product.ratings = avg / (product === null || product === void 0 ? void 0 : product.reviews.length);
        yield (product === null || product === void 0 ? void 0 : product.save());
        const notification = {
            title: "New Review Received",
            message: `${(_a = req.user) === null || _a === void 0 ? void 0 : _a.name} has given a review on ${product === null || product === void 0 ? void 0 : product.name}`,
        };
        //TODO:create notification
        yield notification_model_1.default.create({
            user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
            notification,
        });
        res.status(200).json({
            success: true,
            product,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.AddReviewReply = (0, catchAsyncErrors_1.CatchAsyncMiddleware)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const { comment, productId, reviewId } = req.body;
        const product = yield product_model_1.default.findById(productId);
        if (!product) {
            return next(new ErrorHandler_1.default("Product not found", 500));
        }
        const review = (_c = product === null || product === void 0 ? void 0 : product.reviews) === null || _c === void 0 ? void 0 : _c.find((review) => review._id.toString() === reviewId);
        if (!review) {
            return next(new ErrorHandler_1.default("Review not found", 500));
        }
        // new reply
        const newReply = {
            user: req.user,
            comment,
        };
        if (!review.commentReplies)
            review.commentReplies = [];
        (_d = review.commentReplies) === null || _d === void 0 ? void 0 : _d.push(newReply);
        yield product.save();
        res.status(200).json({
            success: true,
            product,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
//get all products
exports.getProductAll = (0, catchAsyncErrors_1.CatchAsyncMiddleware)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, product_service_1.getProducts)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
//delete product --admin
exports.deleteProduct = (0, catchAsyncErrors_1.CatchAsyncMiddleware)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield product_model_1.default.findById(id);
        if (!product) {
            return next(new ErrorHandler_1.default("Product not found", 404));
        }
        yield product.deleteOne({ id });
        yield redis_1.redis.del(id);
        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
