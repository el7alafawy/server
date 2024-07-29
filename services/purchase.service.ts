import { NextFunction, Response } from "express";
import { CatchAsyncMiddleware } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import PurchaseModel from "../models/purchase.model";

export const newpurchase = CatchAsyncMiddleware(async(data:any,res:Response ,next:NextFunction)=>
{
    try{
        const purchase = await PurchaseModel.create(data);
        res.status(201).json({
            success: true,
            purchase: purchase,
          });
    }catch(error:any)
    {
        return next(new ErrorHandler(error.message, 404));
    }
})
//get all orders 
export const getPurchases = async (res: Response) => {
    const purchases = await PurchaseModel.find().sort({createdAt:-1});
    res.status(201).json({
      success: true,
      purchases,
    });
  }