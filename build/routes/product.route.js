"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const auth_1 = require("../middleware/auth");
const user_controller_1 = require("../controllers/user.controller");
const productRouter = express_1.default.Router();
productRouter.post("/create-product", user_controller_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), product_controller_1.uploadProduct);
productRouter.put("/edit-product/:id", user_controller_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), product_controller_1.editProduct);
productRouter.get("/get-products", product_controller_1.getAllProducts);
productRouter.get("/get-product-content/:id", user_controller_1.updateAccessToken, auth_1.isAuthenticated, product_controller_1.getProduct);
productRouter.put("/add-review/:id", user_controller_1.updateAccessToken, auth_1.isAuthenticated, product_controller_1.AddReview);
productRouter.put("/add-review-reply", user_controller_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), product_controller_1.AddReviewReply);
productRouter.get("/get-all-products", user_controller_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), product_controller_1.getProductAll);
productRouter.delete("/delete-product/:id", user_controller_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), product_controller_1.deleteProduct);
exports.default = productRouter;
