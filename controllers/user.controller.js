"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserRole = exports.getAllUsers = exports.updateProfilePicture = exports.updatePassword = exports.updateUserInfo = exports.socialAuth = exports.getUserInfo = exports.updateAccessToken = exports.logoutUser = exports.loginUser = exports.activateUser = exports.createActivationToken = exports.registerationUser = void 0;
var user_model_1 = require("../models/user.model");
var ErrorHandler_1 = require("../utils/ErrorHandler");
var catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
var jsonwebtoken_1 = require("jsonwebtoken");
var ejs_1 = require("ejs");
var path_1 = require("path");
var sendMail_1 = require("../utils/sendMail");
var jwt_1 = require("../utils/jwt");
var redis_1 = require("../utils/redis");
var user_service_1 = require("../services/user.service");
var cloudinary_1 = require("cloudinary");
require("dotenv").config();
exports.registerationUser = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, phone, email, password, isEmailExist, user, activationToken, activationCode, data, html, error_1, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body, name_1 = _a.name, phone = _a.phone, email = _a.email, password = _a.password;
                return [4 /*yield*/, user_model_1.default.findOne({ email: email })];
            case 1:
                isEmailExist = _b.sent();
                if (isEmailExist) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Email already exist", 400))];
                }
                user = {
                    name: name_1,
                    phone: phone,
                    email: email,
                    password: password,
                };
                activationToken = (0, exports.createActivationToken)(user);
                activationCode = activationToken.activationCode;
                data = { user: { name: user.name }, activationCode: activationCode };
                return [4 /*yield*/, ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/activation-Mail.ejs"), data)];
            case 2:
                html = _b.sent();
                _b.label = 3;
            case 3:
                _b.trys.push([3, 5, , 6]);
                return [4 /*yield*/, (0, sendMail_1.default)({
                        email: user.email,
                        subject: "Activate Your Account",
                        template: "activation-Mail.ejs",
                        data: data,
                    })];
            case 4:
                _b.sent();
                res.status(201).json({
                    success: true,
                    message: "Please check your email ".concat(user.email, " for Activation Code"),
                    activationToken: activationToken.token,
                });
                return [3 /*break*/, 6];
            case 5:
                error_1 = _b.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_1.message, 400))];
            case 6: return [3 /*break*/, 8];
            case 7:
                error_2 = _b.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_2.message, 400))];
            case 8: return [2 /*return*/];
        }
    });
}); });
var createActivationToken = function (user) {
    var activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    var token = jsonwebtoken_1.default.sign({
        user: user,
        activationCode: activationCode,
    }, process.env.ACTIVATION_SECRET, { expiresIn: "5m" });
    return { token: token, activationCode: activationCode };
};
exports.createActivationToken = createActivationToken;
exports.activateUser = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, activation_token, activation_code, newUser, _b, name_2, phone, email, password, existUser, user, error_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = req.body, activation_token = _a.activation_token, activation_code = _a.activation_code;
                newUser = jsonwebtoken_1.default.verify(activation_token, process.env.ACTIVATION_SECRET);
                if (newUser.activationCode !== activation_code) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Invalid activation code", 400))];
                }
                _b = newUser.user, name_2 = _b.name, phone = _b.phone, email = _b.email, password = _b.password;
                return [4 /*yield*/, user_model_1.default.findOne({ email: email })];
            case 1:
                existUser = _c.sent();
                if (existUser) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("User already exists", 400))];
                }
                return [4 /*yield*/, user_model_1.default.create({
                        name: name_2,
                        phone: phone,
                        email: email,
                        password: password,
                    })];
            case 2:
                user = _c.sent();
                res.status(201).json({
                    success: true,
                });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _c.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_3.message, 400))];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.loginUser = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isPasswordMatch, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, password = _a.password;
                if (!email || !password) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Please enter email and password", 400))];
                }
                return [4 /*yield*/, user_model_1.default.findOne({ email: email }).select("+password")];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Invalid email or password", 400))];
                }
                return [4 /*yield*/, user.comparePassword(password)];
            case 2:
                isPasswordMatch = _b.sent();
                if (!isPasswordMatch) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Invalid email or password", 400))];
                }
                (0, jwt_1.sendToken)(user, 200, res);
                return [3 /*break*/, 4];
            case 3:
                error_4 = _b.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_4.message, 400))];
            case 4: return [2 /*return*/];
        }
    });
}); });
//Logout user
exports.logoutUser = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId;
    var _a;
    return __generator(this, function (_b) {
        try {
            res.cookie("access_token", "", { maxAge: 1 });
            res.cookie("refresh_token", "", { maxAge: 1 });
            userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            redis_1.redis.del(userId || "");
            res.status(200).json({
                success: true,
                message: "Logged out successfully",
            });
        }
        catch (error) {
            return [2 /*return*/, next(new ErrorHandler_1.default(error.message, 400))];
        }
        return [2 /*return*/];
    });
}); });
//Update access token
exports.updateAccessToken = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var refresh_token, decoded, message, session, user, accessTokenExpire, refreshTokenExpire, accessToken, refreshToken, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                refresh_token = req.cookies.refresh_token;
                decoded = jsonwebtoken_1.default.verify(refresh_token, process.env.REFRESH_TOKEN);
                message = "Could not refresh token";
                if (!decoded) {
                    return [2 /*return*/, next(new ErrorHandler_1.default(message, 400))];
                }
                return [4 /*yield*/, redis_1.redis.get(decoded.id)];
            case 1:
                session = _a.sent();
                if (!session) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Please login to access this resource", 400))];
                }
                user = JSON.parse(session);
                accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "5", 10);
                refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "7", 10);
                accessToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.ACCESS_TOKEN, {
                    expiresIn: "".concat(accessTokenExpire, "m"),
                });
                refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.REFRESH_TOKEN, {
                    expiresIn: "".concat(refreshTokenExpire, "d"),
                });
                req.user = user;
                res.cookie("access_token", accessToken, jwt_1.accessTokenOptions);
                res.cookie("refresh_token", refreshToken, jwt_1.refreshTokenOptions);
                return [4 /*yield*/, redis_1.redis.set(user._id, JSON.stringify(user), "EX", 7 * 24 * 60 * 60)]; //expires in 7 days | 604800 seconds
            case 2:
                _a.sent(); //expires in 7 days | 604800 seconds
                res.status(200).json({
                    success: true,
                    accessToken: accessToken,
                });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_5.message, 400))];
            case 4: return [2 /*return*/];
        }
    });
}); });
// get user info
exports.getUserInfo = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId;
    var _a;
    return __generator(this, function (_b) {
        try {
            userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) || "";
            (0, user_service_1.getUserById)(userId, res);
        }
        catch (error) {
            return [2 /*return*/, next(new ErrorHandler_1.default(error.message, 400))];
        }
        return [2 /*return*/];
    });
}); });
// social auth
exports.socialAuth = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, name_3, avatar, user, newUser, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, email = _a.email, name_3 = _a.name, avatar = _a.avatar;
                return [4 /*yield*/, user_model_1.default.findOne({ email: email })];
            case 1:
                user = _b.sent();
                if (!!user) return [3 /*break*/, 3];
                return [4 /*yield*/, user_model_1.default.create({ email: email, name: name_3, avatar: avatar })];
            case 2:
                newUser = _b.sent();
                (0, jwt_1.sendToken)(newUser, 200, res);
                return [3 /*break*/, 4];
            case 3:
                (0, jwt_1.sendToken)(user, 200, res);
                _b.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_6 = _b.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_6.message, 400))];
            case 6: return [2 /*return*/];
        }
    });
}); });
exports.updateUserInfo = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_4, email, userId, user, isEmailExist, error_7;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 6, , 7]);
                _a = req.body, name_4 = _a.name, email = _a.email;
                userId = ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id) || "";
                return [4 /*yield*/, user_model_1.default.findById(userId)];
            case 1:
                user = _c.sent();
                if (!(email && user)) return [3 /*break*/, 3];
                return [4 /*yield*/, user_model_1.default.findOne({ email: email })];
            case 2:
                isEmailExist = _c.sent();
                if (isEmailExist) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Email already exist", 400))];
                }
                user.email = email;
                _c.label = 3;
            case 3:
                if (name_4 && user) {
                    user.name = name_4;
                }
                return [4 /*yield*/, (user === null || user === void 0 ? void 0 : user.save())];
            case 4:
                _c.sent();
                return [4 /*yield*/, redis_1.redis.set(userId, JSON.stringify(user))];
            case 5:
                _c.sent();
                res.status(201).json({
                    success: true,
                    user: user,
                });
                return [3 /*break*/, 7];
            case 6:
                error_7 = _c.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_7.message, 400))];
            case 7: return [2 /*return*/];
        }
    });
}); });
exports.updatePassword = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, oldPassword, newPassword, user, isPasswordMatch, error_8;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, , 6]);
                _a = req.body, oldPassword = _a.oldPassword, newPassword = _a.newPassword;
                if (!oldPassword || !newPassword) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Please enter old and new password", 400))];
                }
                return [4 /*yield*/, user_model_1.default.findById((_b = req.user) === null || _b === void 0 ? void 0 : _b._id).select("+password")];
            case 1:
                user = _d.sent();
                if ((user === null || user === void 0 ? void 0 : user.password) === undefined) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Invalid user", 400))];
                }
                return [4 /*yield*/, (user === null || user === void 0 ? void 0 : user.comparePassword(oldPassword))];
            case 2:
                isPasswordMatch = _d.sent();
                if (!isPasswordMatch) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Invalid old password", 400))];
                }
                user.password = newPassword;
                return [4 /*yield*/, user.save()];
            case 3:
                _d.sent();
                return [4 /*yield*/, redis_1.redis.set((_c = req.user) === null || _c === void 0 ? void 0 : _c._id, JSON.stringify(user))];
            case 4:
                _d.sent();
                res.status(201).json({
                    success: true,
                    user: user,
                });
                return [3 /*break*/, 6];
            case 5:
                error_8 = _d.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_8.message, 400))];
            case 6: return [2 /*return*/];
        }
    });
}); });
// update profile picture
exports.updateProfilePicture = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var avatar, userId, user, myCloud, myCloud, error_9;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 9, , 10]);
                avatar = req.body.avatar;
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
                return [4 /*yield*/, user_model_1.default.findById(userId)];
            case 1:
                user = _d.sent();
                if (!(avatar && user)) return [3 /*break*/, 6];
                if (!((_b = user === null || user === void 0 ? void 0 : user.avatar) === null || _b === void 0 ? void 0 : _b.public_id)) return [3 /*break*/, 4];
                // first delete the old image
                return [4 /*yield*/, cloudinary_1.default.v2.uploader.destroy((_c = user === null || user === void 0 ? void 0 : user.avatar) === null || _c === void 0 ? void 0 : _c.public_id)];
            case 2:
                // first delete the old image
                _d.sent();
                return [4 /*yield*/, cloudinary_1.default.v2.uploader.upload(avatar, {
                        folder: "avatars",
                        width: 150,
                    })];
            case 3:
                myCloud = _d.sent();
                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, cloudinary_1.default.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150,
                })];
            case 5:
                myCloud = _d.sent();
                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
                _d.label = 6;
            case 6: return [4 /*yield*/, (user === null || user === void 0 ? void 0 : user.save())];
            case 7:
                _d.sent();
                return [4 /*yield*/, redis_1.redis.set(userId, JSON.stringify(user))];
            case 8:
                _d.sent();
                res.status(200).json({
                    success: true,
                    user: user,
                });
                return [3 /*break*/, 10];
            case 9:
                error_9 = _d.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_9.message, 400))];
            case 10: return [2 /*return*/];
        }
    });
}); });
//get all users -- admin
exports.getAllUsers = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            (0, user_service_1.getUsers)(res);
        }
        catch (error) {
            return [2 /*return*/, next(new ErrorHandler_1.default(error.message, 400))];
        }
        return [2 /*return*/];
    });
}); });
//update user role --admin
exports.updateUserRole = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, role;
    return __generator(this, function (_b) {
        try {
            _a = req.body, id = _a.id, role = _a.role;
            (0, user_service_1.updateUserRoleService)(res, id, role);
        }
        catch (error) {
            return [2 /*return*/, next(new ErrorHandler_1.default(error.message, 400))];
        }
        return [2 /*return*/];
    });
}); });
//delete user --admin
exports.deleteUser = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                id = req.params.id;
                return [4 /*yield*/, user_model_1.default.findById(id)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("User not found", 400))];
                }
                return [4 /*yield*/, user.deleteOne({ id: id })];
            case 2:
                _a.sent();
                return [4 /*yield*/, redis_1.redis.del(id)];
            case 3:
                _a.sent();
                res.status(200).json({
                    success: true,
                    message: "User deleted successfully",
                });
                return [3 /*break*/, 5];
            case 4:
                error_10 = _a.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_10.message, 400))];
            case 5: return [2 /*return*/];
        }
    });
}); });
