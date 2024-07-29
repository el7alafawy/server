import { NextFunction, Request, Response } from "express";
import { CatchAsyncMiddleware } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import userModel from "../models/user.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";
import { IPurchase } from "../models/purchase.model";
import ProductModel from "../models/product.model";
import { getPurchases, newpurchase } from "../services/purchase.service";

//create Purchase
export const createPurchase = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { items, payment_info } = req.body as IPurchase;
      const user = await userModel.findById(req.user?._id);

      items.forEach(async (item) => {
        const product = await ProductModel.findById(item.itemId);
        if (!product) {
          return next(new ErrorHandler("Some products are not available", 404));
        }
      });

      items.forEach(async (item) => {
        const product = await ProductModel.findById(item.itemId);
        if (product) {
          user?.products.push(product._id as any);
          await user?.save();

          product.purchased
            ? (product.purchased += 1)
            : (product.purchased = 1);
          await product.save();
        }
      });

      NotificationModel.create({
        user: user?._id,
        title: "New Purchase",
        message: `You  have a new purchase from ${user?.email}`,
      });
      const data: any = {
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

      newpurchase(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
//get all purchases
export const getAllPurchases = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getPurchases(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
