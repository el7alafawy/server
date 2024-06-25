import { Response } from "express";
import { CatchAsyncMiddleware } from "../middleware/catchAsyncErrors";
import ProductModel from "../models/product.model";
// create course
export const createProduct = CatchAsyncMiddleware(
  async (data: any, res: Response) => {
    const product = await ProductModel.create(data);
    res.status(201).json({
      success: true,
      product,
    });
  }
);
//get all users 
export const getProducts = async (res: Response) => {
  const products = await ProductModel.find().sort({createdAt:-1});
  res.status(201).json({
    success: true,
    products,
  });
}