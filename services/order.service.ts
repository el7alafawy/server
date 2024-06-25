import { NextFunction, Response } from "express";
import { CatchAsyncMiddleware } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel from "../models/order.model";

export const newOrder = CatchAsyncMiddleware(async(data:any,res:Response ,next:NextFunction)=>
{
    try{
        const order = await OrderModel.create(data);
        res.status(201).json({
            success: true,
            order: order,
          });
    }catch(error:any)
    {
        return next(new ErrorHandler(error.message, 404));
    }
})
//get all orders 
export const getOrders = async (res: Response) => {
    const orders = await OrderModel.find().sort({createdAt:-1});
    res.status(201).json({
      success: true,
      orders,
    });
  }