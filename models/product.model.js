"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var reviewSchema = new mongoose_1.Schema({
    user: Object,
    rating: {
        type: Number,
        default: 0,
    },
    comment: String,
    commentReplies: [Object],
});
var commentSchema = new mongoose_1.Schema({
    user: Object,
    comment: String,
    commentReplies: [Object],
});
var productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    estimatedPrice: {
        type: Number,
    },
    thumbnail: {
        public_id: {
            // required: true,
            type: String,
        },
        url: {
            // required: true,
            type: String,
        },
    },
    images: [{
            public_id: {
                // required: true,
                type: String,
            },
            url: {
                // required: true,
                type: String,
            },
        }],
    tags: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
    reviews: [reviewSchema],
    ratings: {
        type: Number,
        default: 0,
    },
    purchased: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
var ProductModel = mongoose_1.default.model("Products", productSchema);
exports.default = ProductModel;
