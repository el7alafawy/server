import { NextFunction, Request, Response } from "express";
import { CatchAsyncMiddleware } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel, { IOrder } from "../models/order.model";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";
import { getOrders, newOrder } from "../services/order.service";

//create order
export const createOrder = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;
      const user = await userModel.findById(req.user?._id);

      const courseOwned = user?.courses.find(
        (course: any) => course._id.toString() === courseId
      );
      if (courseOwned) {
        return next(new ErrorHandler("It's already yours!", 400));
      }
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }
      const data: any = {
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
        user?.courses.push(course._id as any);
      }
      await user?.save();

      NotificationModel.create({
        user: user?._id,
        title: "New Order",
        message: `You  have a new order from ${course.name}`,
      });
      
      course.purchased ? course.purchased+=1 : course.purchased =1;
      await course.save();
      
      newOrder(data, res, next);
      
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
//get all order
export const getAllOrders = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getOrders(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);