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
exports.getLayout = exports.editLayout = exports.createLayout = void 0;
var ErrorHandler_1 = require("../utils/ErrorHandler");
var catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
var layout_model_1 = require("../models/layout.model");
var cloudinary_1 = require("cloudinary");
//create layout
exports.createLayout = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var type, isTypeExists, _a, image, title, subTitle, myCloud, banner, faq, faqItems, categories, categoriesItems, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 11, , 12]);
                type = req.body.type;
                return [4 /*yield*/, layout_model_1.default.findOne({ type: type })];
            case 1:
                isTypeExists = _b.sent();
                if (isTypeExists) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("".concat(type, " already exists"), 400))];
                }
                if (!(type === "Banner")) return [3 /*break*/, 4];
                _a = req.body, image = _a.image, title = _a.title, subTitle = _a.subTitle;
                return [4 /*yield*/, cloudinary_1.default.v2.uploader.upload(image, {
                        folder: "Layout",
                    })];
            case 2:
                myCloud = _b.sent();
                banner = {
                    image: {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url,
                    },
                    title: title,
                    subTitle: subTitle,
                };
                return [4 /*yield*/, layout_model_1.default.create(banner)];
            case 3:
                _b.sent();
                return [3 /*break*/, 10];
            case 4:
                if (!(type === "FAQ")) return [3 /*break*/, 7];
                faq = req.body.faq;
                return [4 /*yield*/, Promise.all(faq.map(function (item) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, { question: item.question, answer: item.answer }];
                        });
                    }); }))];
            case 5:
                faqItems = _b.sent();
                return [4 /*yield*/, layout_model_1.default.create({ type: "FAQ", faq: faqItems })];
            case 6:
                _b.sent();
                return [3 /*break*/, 10];
            case 7:
                if (!(type === "Categories")) return [3 /*break*/, 10];
                categories = req.body.categories;
                return [4 /*yield*/, Promise.all(categories.map(function (item) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, { title: item.title }];
                        });
                    }); }))];
            case 8:
                categoriesItems = _b.sent();
                return [4 /*yield*/, layout_model_1.default.create({
                        type: "Categories",
                        categories: categoriesItems,
                    })];
            case 9:
                _b.sent();
                _b.label = 10;
            case 10:
                res.status(200).json({
                    success: true,
                    message: "Layout created successfully",
                });
                return [3 /*break*/, 12];
            case 11:
                error_1 = _b.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_1.message, 400))];
            case 12: return [2 /*return*/];
        }
    });
}); });
//edit layout
exports.editLayout = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var type, bannerData, _a, image, title, subTitle, myCloud, banner, faqData, faq, faqItems, categoriesData, categories, categoriesItems, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 14, , 15]);
                type = req.body.type;
                if (!(type === "Banner")) return [3 /*break*/, 5];
                return [4 /*yield*/, layout_model_1.default.findOne({ type: "Banner" })];
            case 1:
                bannerData = _b.sent();
                _a = req.body, image = _a.image, title = _a.title, subTitle = _a.subTitle;
                return [4 /*yield*/, cloudinary_1.default.v2.uploader.destroy(bannerData.image.public_id)];
            case 2:
                _b.sent();
                return [4 /*yield*/, cloudinary_1.default.v2.uploader.upload(image, {
                        folder: "Layout",
                    })];
            case 3:
                myCloud = _b.sent();
                banner = {
                    image: {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url,
                    },
                    title: title,
                    subTitle: subTitle,
                };
                return [4 /*yield*/, layout_model_1.default.findByIdAndUpdate(bannerData._id, { banner: banner })];
            case 4:
                _b.sent();
                return [3 /*break*/, 13];
            case 5:
                if (!(type === "FAQ")) return [3 /*break*/, 9];
                return [4 /*yield*/, layout_model_1.default.findOne({ type: "FAQ" })];
            case 6:
                faqData = _b.sent();
                faq = req.body.faq;
                return [4 /*yield*/, Promise.all(faq.map(function (item) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, { question: item.question, answer: item.answer }];
                        });
                    }); }))];
            case 7:
                faqItems = _b.sent();
                return [4 /*yield*/, layout_model_1.default.findByIdAndUpdate(faqData._id, {
                        type: "FAQ",
                        faq: faqItems,
                    })];
            case 8:
                _b.sent();
                return [3 /*break*/, 13];
            case 9:
                if (!(type === "Categories")) return [3 /*break*/, 13];
                return [4 /*yield*/, layout_model_1.default.findOne({
                        type: "Categories",
                    })];
            case 10:
                categoriesData = _b.sent();
                categories = req.body.categories;
                return [4 /*yield*/, Promise.all(categories.map(function (item) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, { title: item.title }];
                        });
                    }); }))];
            case 11:
                categoriesItems = _b.sent();
                return [4 /*yield*/, layout_model_1.default.findByIdAndUpdate(categoriesData._id, {
                        type: "Categories",
                        categories: categoriesItems,
                    })];
            case 12:
                _b.sent();
                _b.label = 13;
            case 13:
                res.status(200).json({
                    success: true,
                    message: "Layout updated successfully",
                });
                return [3 /*break*/, 15];
            case 14:
                error_2 = _b.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_2.message, 400))];
            case 15: return [2 /*return*/];
        }
    });
}); });
//get layout by type
exports.getLayout = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var layout, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, layout_model_1.default.findOne({ type: req.body.type })];
            case 1:
                layout = _a.sent();
                if (!layout) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("".concat(req.body.type, "  not found"), 404))];
                }
                res.status(200).json({
                    success: true,
                    layout: layout,
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_3.message, 400))];
            case 3: return [2 /*return*/];
        }
    });
}); });
