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
exports.getLayout = exports.editLayout = exports.createLayout = void 0;
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const layout_model_1 = __importDefault(require("../models/layout.model"));
const cloudinary_1 = __importDefault(require("cloudinary"));
//create layout
exports.createLayout = (0, catchAsyncErrors_1.CatchAsyncMiddleware)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.body;
        const isTypeExists = yield layout_model_1.default.findOne({ type });
        if (isTypeExists) {
            return next(new ErrorHandler_1.default(`${type} already exists`, 400));
        }
        if (type === "Banner") {
            const { image, title, subTitle } = req.body;
            const myCloud = yield cloudinary_1.default.v2.uploader.upload(image, {
                folder: "Layout",
            });
            const banner = {
                image: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                },
                title,
                subTitle,
            };
            yield layout_model_1.default.create(banner);
        }
        else if (type === "FAQ") {
            const { faq } = req.body;
            const faqItems = yield Promise.all(faq.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                return { question: item.question, answer: item.answer };
            })));
            yield layout_model_1.default.create({ type: "FAQ", faq: faqItems });
        }
        else if (type === "Categories") {
            const { categories } = req.body;
            const categoriesItems = yield Promise.all(categories.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                return { title: item.title };
            })));
            yield layout_model_1.default.create({
                type: "Categories",
                categories: categoriesItems,
            });
        }
        res.status(200).json({
            success: true,
            message: "Layout created successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
//edit layout
exports.editLayout = (0, catchAsyncErrors_1.CatchAsyncMiddleware)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.body;
        if (type === "Banner") {
            const bannerData = yield layout_model_1.default.findOne({ type: "Banner" });
            const { image, title, subTitle } = req.body;
            yield cloudinary_1.default.v2.uploader.destroy(bannerData.image.public_id);
            const myCloud = yield cloudinary_1.default.v2.uploader.upload(image, {
                folder: "Layout",
            });
            const banner = {
                image: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                },
                title,
                subTitle,
            };
            yield layout_model_1.default.findByIdAndUpdate(bannerData._id, { banner });
        }
        else if (type === "FAQ") {
            const faqData = yield layout_model_1.default.findOne({ type: "FAQ" });
            const { faq } = req.body;
            const faqItems = yield Promise.all(faq.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                return { question: item.question, answer: item.answer };
            })));
            yield layout_model_1.default.findByIdAndUpdate(faqData._id, {
                type: "FAQ",
                faq: faqItems,
            });
        }
        else if (type === "Categories") {
            const categoriesData = yield layout_model_1.default.findOne({
                type: "Categories",
            });
            const { categories } = req.body;
            const categoriesItems = yield Promise.all(categories.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                return { title: item.title };
            })));
            yield layout_model_1.default.findByIdAndUpdate(categoriesData._id, {
                type: "Categories",
                categories: categoriesItems,
            });
        }
        res.status(200).json({
            success: true,
            message: "Layout updated successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
//get layout by type
exports.getLayout = (0, catchAsyncErrors_1.CatchAsyncMiddleware)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const layout = yield layout_model_1.default.findOne({ type: req.body.type });
        if (!layout) {
            return next(new ErrorHandler_1.default(`${req.body.type}  not found`, 404));
        }
        res.status(200).json({
            success: true,
            layout,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
