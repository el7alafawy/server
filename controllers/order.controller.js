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
exports.getAllOrders = exports.createOrder = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const user_model_1 = __importDefault(require("../models/user.model"));
const course_model_1 = __importDefault(require("../models/course.model"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const order_service_1 = require("../services/order.service");
//create order
exports.createOrder = (0, catchAsyncErrors_1.CatchAsyncMiddleware)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { courseId, payment_info } = req.body;
        const user = yield user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        const courseOwned = user === null || user === void 0 ? void 0 : user.courses.find((course) => course._id.toString() === courseId);
        if (courseOwned) {
            return next(new ErrorHandler_1.default("It's already yours!", 400));
        }
        const course = yield course_model_1.default.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        const data = {
            courseId: course._id,
            userId: user === null || user === void 0 ? void 0 : user._id,
            payment_info,
        };
        const mailData = {
            order: {
                _id: courseId.slice(0, 6),
                name: course.name,
                price: course.price,
                date: new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
            },
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
        if (course) {
            user === null || user === void 0 ? void 0 : user.courses.push(course._id);
        }
        yield (user === null || user === void 0 ? void 0 : user.save());
        notification_model_1.default.create({
            user: user === null || user === void 0 ? void 0 : user._id,
            title: "New Order",
            message: `You  have a new order from ${course.name}`,
        });
        course.purchased ? course.purchased += 1 : course.purchased = 1;
        yield course.save();
        (0, order_service_1.newOrder)(data, res, next);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
//get all order
exports.getAllOrders = (0, catchAsyncErrors_1.CatchAsyncMiddleware)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, order_service_1.getOrders)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
