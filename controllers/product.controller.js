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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.getProductAll = exports.AddReviewReply = exports.AddReview = exports.getProduct = exports.getAllProducts = exports.editProduct = exports.uploadProduct = void 0;
var catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
var ErrorHandler_1 = require("../utils/ErrorHandler");
var cloudinary_1 = require("cloudinary");
var product_model_1 = require("../models/product.model");
var redis_1 = require("../utils/redis");
var notification_model_1 = require("../models/notification.model");
var product_service_1 = require("../services/product.service");
// upload product
exports.uploadProduct = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var data, thumbnail, images, myCloud, i, myCloud, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                data = req.body;
                thumbnail = data.thumbnail;
                images = data.images;
                if (!thumbnail) return [3 /*break*/, 2];
                return [4 /*yield*/, cloudinary_1.default.v2.uploader.upload(thumbnail, {
                        folder: "products",
                    })];
            case 1:
                myCloud = _a.sent();
                data.thumbnail = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
                _a.label = 2;
            case 2:
                if (!images) return [3 /*break*/, 6];
                i = 0;
                _a.label = 3;
            case 3:
                if (!(i < images.length)) return [3 /*break*/, 6];
                return [4 /*yield*/, cloudinary_1.default.v2.uploader.upload(thumbnail, {
                        folder: "products",
                    })];
            case 4:
                myCloud = _a.sent();
                images[i] = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
                _a.label = 5;
            case 5:
                i++;
                return [3 /*break*/, 3];
            case 6:
                (0, product_service_1.createProduct)(data, res, next);
                return [3 /*break*/, 8];
            case 7:
                error_1 = _a.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_1.message, 500))];
            case 8: return [2 /*return*/];
        }
    });
}); });
//edit Product
exports.editProduct = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var data, thumbnail, images, myCloud, i, myCloud, productId, product, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 10, , 11]);
                data = req.body;
                thumbnail = data.thumbnail;
                images = data.images;
                if (!thumbnail) return [3 /*break*/, 3];
                return [4 /*yield*/, cloudinary_1.default.v2.uploader.destroy(thumbnail.public_id)];
            case 1:
                _a.sent();
                return [4 /*yield*/, cloudinary_1.default.v2.uploader.upload(thumbnail, {
                        folder: "products",
                    })];
            case 2:
                myCloud = _a.sent();
                data.thumbnail = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
                _a.label = 3;
            case 3:
                if (!images) return [3 /*break*/, 8];
                i = 0;
                _a.label = 4;
            case 4:
                if (!(i < images.length)) return [3 /*break*/, 8];
                return [4 /*yield*/, cloudinary_1.default.v2.uploader.destroy(thumbnail.public_id)];
            case 5:
                _a.sent();
                return [4 /*yield*/, cloudinary_1.default.v2.uploader.upload(thumbnail, {
                        folder: "products",
                    })];
            case 6:
                myCloud = _a.sent();
                images[i] = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
                _a.label = 7;
            case 7:
                i++;
                return [3 /*break*/, 4];
            case 8:
                productId = req.params.id;
                return [4 /*yield*/, product_model_1.default.findByIdAndUpdate(productId, {
                        $set: data,
                    }, { new: true })];
            case 9:
                product = _a.sent();
                res.status(201).json({
                    success: true,
                    product: product,
                });
                return [3 /*break*/, 11];
            case 10:
                error_2 = _a.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_2.message, 500))];
            case 11: return [2 /*return*/];
        }
    });
}); });
//get all  products
exports.getAllProducts = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var isCacheExist, products, products, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, redis_1.redis.get("allProducts")];
            case 1:
                isCacheExist = _a.sent();
                if (!isCacheExist) return [3 /*break*/, 2];
                products = JSON.parse(isCacheExist);
                res.status(200).json({
                    success: true,
                    products: products,
                });
                return [3 /*break*/, 5];
            case 2: return [4 /*yield*/, product_model_1.default.find()];
            case 3:
                products = _a.sent();
                return [4 /*yield*/, redis_1.redis.set("allProducts", JSON.stringify(products))];
            case 4:
                _a.sent();
                res.status(200).json({
                    success: true,
                    products: products,
                });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_3 = _a.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_3.message, 500))];
            case 7: return [2 /*return*/];
        }
    });
}); });
//get product
exports.getProduct = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var productId, product, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                productId = req.params.id;
                return [4 /*yield*/, product_model_1.default.findById(productId)];
            case 1:
                product = _a.sent();
                res.status(200).json({
                    success: true,
                    product: product,
                });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_4.message, 500))];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.AddReview = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var productId, product, _a, review, rating, newReview, avg_1, notification, error_5;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 4, , 5]);
                productId = req.params.id;
                return [4 /*yield*/, product_model_1.default.findById(productId)];
            case 1:
                product = _d.sent();
                _a = req.body, review = _a.review, rating = _a.rating;
                newReview = {
                    user: req === null || req === void 0 ? void 0 : req.user,
                    comment: review,
                    rating: rating,
                };
                //add review to product
                product === null || product === void 0 ? void 0 : product.reviews.push(newReview);
                avg_1 = 0;
                product === null || product === void 0 ? void 0 : product.reviews.forEach(function (review) {
                    avg_1 += review.rating;
                });
                if (product)
                    product.ratings = avg_1 / (product === null || product === void 0 ? void 0 : product.reviews.length);
                return [4 /*yield*/, (product === null || product === void 0 ? void 0 : product.save())];
            case 2:
                _d.sent();
                notification = {
                    title: "New Review Received",
                    message: "".concat((_b = req.user) === null || _b === void 0 ? void 0 : _b.name, " has given a review on ").concat(product === null || product === void 0 ? void 0 : product.name),
                };
                //TODO:create notification
                return [4 /*yield*/, notification_model_1.default.create({
                        user: (_c = req.user) === null || _c === void 0 ? void 0 : _c._id,
                        notification: notification,
                    })];
            case 3:
                //TODO:create notification
                _d.sent();
                res.status(200).json({
                    success: true,
                    product: product,
                });
                return [3 /*break*/, 5];
            case 4:
                error_5 = _d.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_5.message, 500))];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.AddReviewReply = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, comment, productId, reviewId_1, product, review, newReply, error_6;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                _a = req.body, comment = _a.comment, productId = _a.productId, reviewId_1 = _a.reviewId;
                return [4 /*yield*/, product_model_1.default.findById(productId)];
            case 1:
                product = _d.sent();
                if (!product) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Product not found", 500))];
                }
                review = (_b = product === null || product === void 0 ? void 0 : product.reviews) === null || _b === void 0 ? void 0 : _b.find(function (review) { return review._id.toString() === reviewId_1; });
                if (!review) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Review not found", 500))];
                }
                newReply = {
                    user: req.user,
                    comment: comment,
                };
                if (!review.commentReplies)
                    review.commentReplies = [];
                (_c = review.commentReplies) === null || _c === void 0 ? void 0 : _c.push(newReply);
                return [4 /*yield*/, product.save()];
            case 2:
                _d.sent();
                res.status(200).json({
                    success: true,
                    product: product,
                });
                return [3 /*break*/, 4];
            case 3:
                error_6 = _d.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_6.message, 500))];
            case 4: return [2 /*return*/];
        }
    });
}); });
//get all products
exports.getProductAll = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            (0, product_service_1.getProducts)(res);
        }
        catch (error) {
            return [2 /*return*/, next(new ErrorHandler_1.default(error.message, 500))];
        }
        return [2 /*return*/];
    });
}); });
//delete product --admin
exports.deleteProduct = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, product, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                id = req.params.id;
                return [4 /*yield*/, product_model_1.default.findById(id)];
            case 1:
                product = _a.sent();
                if (!product) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Product not found", 404))];
                }
                return [4 /*yield*/, product.deleteOne({ id: id })];
            case 2:
                _a.sent();
                return [4 /*yield*/, redis_1.redis.del(id)];
            case 3:
                _a.sent();
                res.status(200).json({
                    success: true,
                    message: "Product deleted successfully",
                });
                return [3 /*break*/, 5];
            case 4:
                error_7 = _a.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_7.message, 500))];
            case 5: return [2 /*return*/];
        }
    });
}); });
