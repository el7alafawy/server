"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var orderSchema = new mongoose_1.Schema({
    courseId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    payment_info: {
        type: Object,
        // required:true
    },
}, { timestamps: true });
var OrderModel = mongoose_1.default.model("Order", orderSchema);
exports.default = OrderModel;
