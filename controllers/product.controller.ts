import { NextFunction, Request, Response } from "express";
import { CatchAsyncMiddleware } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import ProductModel from "../models/product.model";
import { redis } from "../utils/redis";
import NotificationModel from "../models/notification.model";
import { createProduct, getProducts } from "../services/product.service";
// upload product
export const uploadProduct = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      const images = data.images;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "products",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      if (images) {
        for (let i = 0; i < images.length; i++)
        {
          const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "products",
        });
        images[i] = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      }
      createProduct(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
//edit Product
export const editProduct = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      const images = data.images;
      if (thumbnail) {
        await cloudinary.v2.uploader.destroy(thumbnail.public_id);
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "products",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      if (images) {
        for (let i = 0; i < images.length; i++)
        {
          await cloudinary.v2.uploader.destroy(thumbnail.public_id);
          const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "products",
        });
        images[i] = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      }
      const productId = req.params.id;

      const product = await ProductModel.findByIdAndUpdate(
        productId,
        {
          $set: data,
        },
        { new: true }
      );

      res.status(201).json({
        success: true,
        product,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get all  products
export const getAllProducts = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCacheExist = await redis.get("allProducts");
      if (isCacheExist) {
        const products = JSON.parse(isCacheExist);
        res.status(200).json({
          success: true,
          products,
        });
      } else {
        const products = await ProductModel.find();
        await redis.set("allProducts", JSON.stringify(products));
        res.status(200).json({
          success: true,
          products,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get product
export const getProduct = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = req.params.id;
      const product = await ProductModel.findById(productId);
      res.status(200).json({
        success: true,
        product,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//add review

interface IAddReviewData {
  review: string;
  productId: string;
  rating: number;
  userId: string;
}

export const AddReview = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      const productId = req.params.id;

      const product = await ProductModel.findById(productId);

      const { review, rating } = req.body as IAddReviewData;
      //new Review
      const newReview: any = {
        user: req?.user,
        comment: review,
        rating,
      };
      //add review to product
      product?.reviews.push(newReview);

      let avg = 0;
      product?.reviews.forEach((review: any) => {
        avg += review.rating;
      });

      if (product) product.ratings = avg / product?.reviews.length;

      await product?.save();

      const notification = {
        title: "New Review Received",
        message: `${req.user?.name} has given a review on ${product?.name}`,
      };

      //TODO:create notification
      await NotificationModel.create({
        user: req.user?._id,
        notification,
      });
      res.status(200).json({
        success: true,
        product,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add reply to review
interface IAddReviewReplyData {
  comment: string;
  productId: string;
  reviewId: string;
}
export const AddReviewReply = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, productId, reviewId } = req.body as IAddReviewReplyData;
      const product = await ProductModel.findById(productId);
      if (!product) {
        return next(new ErrorHandler("Product not found", 500));
      }
      const review = product?.reviews?.find(
        (review: any) => review._id.toString() === reviewId
      );
      if (!review) {
        return next(new ErrorHandler("Review not found", 500));
      }
      // new reply
      const newReply: any = {
        user: req.user,
        comment,
      };
      if (!review.commentReplies) review.commentReplies = [];
      review.commentReplies?.push(newReply);
      await product.save();

      res.status(200).json({
        success: true,
        product,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
//get all products
export const getProductAll = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getProducts(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
//delete product --admin
export const deleteProduct = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const product = await ProductModel.findById(id);
      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }
      await product.deleteOne({ id });
      await redis.del(id);
      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
