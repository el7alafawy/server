"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPurchases = exports.createPurchase = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const user_model_1 = __importDefault(require("../models/user.model"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const purchase_service_1 = require("../services/purchase.service");
//create Purchase
exports.createPurchase = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(async (req, res, next) => {
    try {
        const { items, payment_info } = req.body;
        const user = await user_model_1.default.findById(req.user?._id);
        items.forEach(async (item) => {
            const product = await product_model_1.default.findById(item.itemId);
            if (!product) {
                return next(new ErrorHandler_1.default("Some products are not available", 404));
            }
        });
        items.forEach(async (item) => {
            const product = await product_model_1.default.findById(item.itemId);
            if (product) {
                user?.products.push(product._id);
                await user?.save();
                product.purchased
                    ? (product.purchased += 1)
                    : (product.purchased = 1);
                await product.save();
            }
        });
        notification_model_1.default.create({
            user: user?._id,
            title: "New Purchase",
            message: `You  have a new purchase from ${user?.email}`,
        });
        const data = {
            items,
            userId: user?._id,
            payment_info,
        };
        //TODO : Make order confirmation email template
        // const html = await ejs.renderFile(path.join(__dirname,"../mails/"),{order:mailData})
        // try
        // {
        //     if(user)
        //         {
        //             await sendMail(
        //                 {
        //                     email:user.email,
        //                     subject:"Order Confirmation",
        //                     template:"order-confirmation.ejs",
        //                     data:mailData
        //                 }
        //             )
        //         }
        // }catch(error:any)
        // {
        //     return next(new ErrorHandler(error.message, 500));
        // }
        (0, purchase_service_1.newpurchase)(data, res, next);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//get all purchases
exports.getAllPurchases = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(async (req, res, next) => {
    try {
        (0, purchase_service_1.getPurchases)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
