"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var faqSchema = new mongoose_1.Schema({
    question: {
        type: String,
    },
    answer: {
        type: String,
    },
});
var categorySchema = new mongoose_1.Schema({
    title: {
        type: String,
    },
});
var bannerImageSchmea = new mongoose_1.Schema({
    public_id: {
        type: String,
    },
    url: {
        type: String,
    },
});
var layoutSchema = new mongoose_1.Schema({
    type: { type: String },
    faq: [faqSchema],
    categories: [categorySchema],
    banner: {
        image: bannerImageSchmea,
        title: { type: String },
        subTitle: { type: String },
    },
});
var LayoutModel = (0, mongoose_1.model)("Layout", layoutSchema);
exports.default = LayoutModel;
