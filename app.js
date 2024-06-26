"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var express_1 = require("express");
var cors_1 = require("cors");
var cookie_parser_1 = require("cookie-parser");
var error_1 = require("./middleware/error");
var user_route_1 = require("./routes/user.route");
var course_route_1 = require("./routes/course.route");
var order_route_1 = require("./routes/order.route");
var notification_router_1 = require("./routes/notification.router");
var analytics_route_1 = require("./routes/analytics.route");
var layout_route_1 = require("./routes/layout.route");
var product_route_1 = require("./routes/product.route");
require("dotenv").config();
exports.app = (0, express_1.default)();
// body parser
exports.app.use(express_1.default.json({ limit: "50mb" }));
// cookie parser
exports.app.use((0, cookie_parser_1.default)());
// cors
exports.app.use((0, cors_1.default)({
    origin: ['http://localhost:3000'],
    credentials: true,
}));
//routes
exports.app.use("/api/v1", user_route_1.default);
exports.app.use("/api/v1", course_route_1.default);
exports.app.use("/api/v1", order_route_1.default);
exports.app.use("/api/v1", notification_router_1.default);
exports.app.use("/api/v1", analytics_route_1.default);
exports.app.use("/api/v1", layout_route_1.default);
exports.app.use("/api/v1", product_route_1.default);
// testing api
exports.app.get("/test", function (req, res, next) {
    res.status(200).json({
        success: true,
        message: "api is working",
    });
});
// unknown route
exports.app.all("*", function (req, res, next) {
    var err = new Error("Route ".concat(req.originalUrl, " not found"));
    res.status(404);
    next(err);
});
exports.app.use(error_1.ErrorMiddleware);
