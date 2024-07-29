"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const user_controller_1 = require("../controllers/user.controller");
const purchase_controller_1 = require("../controllers/purchase.controller");
const purchaseRouter = express_1.default.Router();
purchaseRouter.post("/create-purchase", user_controller_1.updateAccessToken, auth_1.isAuthenticated, purchase_controller_1.createPurchase);
purchaseRouter.get("/get-purchases", user_controller_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), purchase_controller_1.getAllPurchases);
exports.default = purchaseRouter;
