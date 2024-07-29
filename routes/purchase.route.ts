import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { updateAccessToken } from "../controllers/user.controller";
import { createPurchase, getAllPurchases } from "../controllers/purchase.controller";
const purchaseRouter = express.Router();
purchaseRouter.post("/create-purchase",updateAccessToken, isAuthenticated, createPurchase);
purchaseRouter.get("/get-purchases",updateAccessToken, isAuthenticated,authorizeRoles("admin"), getAllPurchases);
export default purchaseRouter;
