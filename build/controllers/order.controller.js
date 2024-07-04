"use strict";
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
exports.createOrder = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(async (req, res, next) => {
    try {
        const { courseId, payment_info } = req.body;
        const user = await user_model_1.default.findById(req.user?._id);
        const courseOwned = user?.courses.find((course) => course._id.toString() === courseId);
        if (courseOwned) {
            return next(new ErrorHandler_1.default("It's already yours!", 400));
        }
        const course = await course_model_1.default.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        const data = {
            courseId: course._id,
            userId: user?._id,
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
            user?.courses.push(course._id);
        }
        await user?.save();
        notification_model_1.default.create({
            user: user?._id,
            title: "New Order",
            message: `You  have a new order from ${course.name}`,
        });
        course.purchased ? course.purchased += 1 : course.purchased = 1;
        await course.save();
        (0, order_service_1.newOrder)(data, res, next);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//get all order
exports.getAllOrders = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(async (req, res, next) => {
    try {
        (0, order_service_1.getOrders)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
