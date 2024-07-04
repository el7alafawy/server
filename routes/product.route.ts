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
import { updateAccessToken } from "../controllers/user.controller";
const productRouter = express.Router();

productRouter.post(
  "/create-product",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  uploadProduct
);

productRouter.put(
  "/edit-product/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  editProduct
);

productRouter.get("/get-products", getAllProducts);
productRouter.get("/get-product-content/:id",updateAccessToken,isAuthenticated, getProduct);


productRouter.put(
  "/add-review/:id",
  updateAccessToken,
  isAuthenticated,
  AddReview
);
productRouter.put(
  "/add-review-reply",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  AddReviewReply
);
productRouter.get(
  "/get-all-products",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getProductAll
);
productRouter.delete(
  "/delete-product/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  deleteProduct
);
export default productRouter;
