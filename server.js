"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
var db_1 = require("./utils/db");
var cloudinary_1 = require("cloudinary");
require("dotenv").config();
//cloudiinary config
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY
});
//creating server
app_1.app.listen(process.env.PORT, function () {
    console.log("server is connected with port ".concat(process.env.PORT));
    (0, db_1.default)();
});
