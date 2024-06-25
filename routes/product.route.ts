import express from "express";
import {
  AddReview,
  AddReviewReply,
  deleteProduct,
  editProduct,
  getAllProducts,
  getProduct,
  getProductAll,
  uploadProduct,
} from "../controllers/product.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
const productRouter = express.Router();

productRouter.post(
  "/create-product",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadProduct
);

productRouter.put(
  "/edit-product/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  editProduct
);

productRouter.get("/get-products", getAllProducts);
productRouter.get("/get-product-content/:id",isAuthenticated, getProduct);


productRouter.put(
  "/add-review/:id",
  isAuthenticated,
  AddReview
);
productRouter.put(
  "/add-review-reply",
  isAuthenticated,
  authorizeRoles("admin"),
  AddReviewReply
);
productRouter.get(
  "/get-all-products",
  isAuthenticated,
  authorizeRoles("admin"),
  getProductAll
);
productRouter.delete(
  "/delete-product/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteProduct
);
export default productRouter;
