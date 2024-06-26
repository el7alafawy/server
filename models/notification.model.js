"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var notificationSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: "unread",
    },
}, { timestamps: true });
var NotificationModel = mongoose_1.default.model("Notification", notificationSchema);
exports.default = NotificationModel;
