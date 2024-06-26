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
exports.deleteCourse = exports.getCoursesAll = exports.AddReviewReply = exports.AddReview = exports.AddReply = exports.AddQuestion = exports.getCourseByUser = exports.getAllCourses = exports.getSingleCourse = exports.editCourse = exports.uploadCourse = void 0;
var catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
var ErrorHandler_1 = require("../utils/ErrorHandler");
var cloudinary_1 = require("cloudinary");
var course_service_1 = require("../services/course.service");
var course_model_1 = require("../models/course.model");
var redis_1 = require("../utils/redis");
var mongoose_1 = require("mongoose");
var path_1 = require("path");
var ejs_1 = require("ejs");
var sendMail_1 = require("../utils/sendMail");
var notification_model_1 = require("../models/notification.model");
// upload course
exports.uploadCourse = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var data, thumbnail, myCloud, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                data = req.body;
                thumbnail = data.thumbnail;
                if (!thumbnail) return [3 /*break*/, 2];
                return [4 /*yield*/, cloudinary_1.default.v2.uploader.upload(thumbnail, {
                        folder: "courses",
                    })];
            case 1:
                myCloud = _a.sent();
                data.thumbnail = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
                _a.label = 2;
            case 2:
                (0, course_service_1.createCourse)(data, res, next);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_1.message, 500))];
            case 4: return [2 /*return*/];
        }
    });
}); });
//edit Course
exports.editCourse = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var data, thumbnail, myCloud, courseId, course, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                data = req.body;
                thumbnail = data.thumbnail;
                if (!thumbnail) return [3 /*break*/, 3];
                return [4 /*yield*/, cloudinary_1.default.v2.uploader.destroy(thumbnail.public_id)];
            case 1:
                _a.sent();
                return [4 /*yield*/, cloudinary_1.default.v2.uploader.upload(thumbnail, {
                        folder: "courses",
                    })];
            case 2:
                myCloud = _a.sent();
                data.thumbnail = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
                _a.label = 3;
            case 3:
                courseId = req.params.id;
                return [4 /*yield*/, course_model_1.default.findByIdAndUpdate(courseId, {
                        $set: data,
                    }, { new: true })];
            case 4:
                course = _a.sent();
                res.status(201).json({
                    success: true,
                    course: course,
                });
                return [3 /*break*/, 6];
            case 5:
                error_2 = _a.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_2.message, 500))];
            case 6: return [2 /*return*/];
        }
    });
}); });
//get single course --- without purchasing
exports.getSingleCourse = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var courseId, isCacheExist, course, course, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                courseId = req.params.id;
                return [4 /*yield*/, redis_1.redis.get(courseId)];
            case 1:
                isCacheExist = _a.sent();
                if (!isCacheExist) return [3 /*break*/, 2];
                course = JSON.parse(isCacheExist);
                res.status(200).json({
                    success: true,
                    course: course,
                });
                return [3 /*break*/, 5];
            case 2: return [4 /*yield*/, course_model_1.default.findById(courseId).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links")];
            case 3:
                course = _a.sent();
                return [4 /*yield*/, redis_1.redis.set(courseId, JSON.stringify(course), "EX", 7 * 24 * 60 * 60)];
            case 4:
                _a.sent(); //expires in 7 days |604800
                res.status(200).json({
                    success: true,
                    course: course,
                });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_3 = _a.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_3.message, 500))];
            case 7: return [2 /*return*/];
        }
    });
}); });
//get all  courses --- without purchasing
exports.getAllCourses = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var isCacheExist, courses, courses, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, redis_1.redis.get("allCourses")];
            case 1:
                isCacheExist = _a.sent();
                if (!isCacheExist) return [3 /*break*/, 2];
                courses = JSON.parse(isCacheExist);
                res.status(200).json({
                    success: true,
                    courses: courses,
                });
                return [3 /*break*/, 5];
            case 2: return [4 /*yield*/, course_model_1.default.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links")];
            case 3:
                courses = _a.sent();
                return [4 /*yield*/, redis_1.redis.set("allCourses", JSON.stringify(courses))];
            case 4:
                _a.sent();
                res.status(200).json({
                    success: true,
                    courses: courses,
                });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_4 = _a.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_4.message, 500))];
            case 7: return [2 /*return*/];
        }
    });
}); });
//get course content --valid user
exports.getCourseByUser = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userCourseList, courseId_1, courseExists, course, content, error_5;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                userCourseList = (_a = req.user) === null || _a === void 0 ? void 0 : _a.courses;
                courseId_1 = req.params.id;
                courseExists = userCourseList === null || userCourseList === void 0 ? void 0 : userCourseList.find(function (course) { return course._id.toString() === courseId_1; });
                if (!courseExists) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Please buy the course first :)", 404))];
                }
                return [4 /*yield*/, course_model_1.default.findById(courseId_1)];
            case 1:
                course = _b.sent();
                content = course === null || course === void 0 ? void 0 : course.courseData;
                res.status(200).json({
                    success: true,
                    content: content,
                });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _b.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_5.message, 500))];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.AddQuestion = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, question, courseId, contentId_1, course, courseContent, newQuestion, error_6;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 4, , 5]);
                _a = req.body, question = _a.question, courseId = _a.courseId, contentId_1 = _a.contentId;
                return [4 /*yield*/, course_model_1.default.findById(courseId)];
            case 1:
                course = _d.sent();
                if (!mongoose_1.default.Types.ObjectId.isValid(contentId_1)) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Invalid content ID", 404))];
                }
                courseContent = (_b = course === null || course === void 0 ? void 0 : course.courseData) === null || _b === void 0 ? void 0 : _b.find(function (item) {
                    return item._id.equals(contentId_1);
                });
                if (!courseContent) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Invalid content ID", 404))];
                }
                newQuestion = {
                    user: req.user,
                    question: question,
                    questionReplies: [],
                };
                return [4 /*yield*/, notification_model_1.default.create({
                        user: (_c = req.user) === null || _c === void 0 ? void 0 : _c._id,
                        title: "New Question",
                        message: "You  have a new question in ".concat(course === null || course === void 0 ? void 0 : course.name, " => ").concat(courseContent.title),
                    })];
            case 2:
                _d.sent();
                // add question to course content
                courseContent.questions.push(newQuestion);
                //save update course
                return [4 /*yield*/, (course === null || course === void 0 ? void 0 : course.save())];
            case 3:
                //save update course
                _d.sent();
                res.status(200).json({
                    success: true,
                    course: course,
                });
                return [3 /*break*/, 5];
            case 4:
                error_6 = _d.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_6.message, 500))];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.AddReply = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, reply, courseId, contentId_2, questionId_1, course, courseContent, question, newReply, data, html, error_7, error_8;
    var _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _g.trys.push([0, 10, , 11]);
                _a = req.body, reply = _a.reply, courseId = _a.courseId, contentId_2 = _a.contentId, questionId_1 = _a.questionId;
                return [4 /*yield*/, course_model_1.default.findById(courseId)];
            case 1:
                course = _g.sent();
                if (!mongoose_1.default.Types.ObjectId.isValid(contentId_2)) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Invalid content ID", 404))];
                }
                courseContent = (_b = course === null || course === void 0 ? void 0 : course.courseData) === null || _b === void 0 ? void 0 : _b.find(function (item) {
                    return item._id.equals(contentId_2);
                });
                if (!courseContent) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Invalid content ID", 404))];
                }
                question = (_c = courseContent === null || courseContent === void 0 ? void 0 : courseContent.questions) === null || _c === void 0 ? void 0 : _c.find(function (question) {
                    return question._id.equals(questionId_1);
                });
                if (!question) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Invalid question ID", 404))];
                }
                newReply = {
                    user: req.user,
                    reply: reply,
                };
                //add reply to question replies
                (_d = question === null || question === void 0 ? void 0 : question.questionReplies) === null || _d === void 0 ? void 0 : _d.push(newReply);
                //save data to course
                return [4 /*yield*/, (course === null || course === void 0 ? void 0 : course.save())];
            case 2:
                //save data to course
                _g.sent();
                if (!(((_e = req.user) === null || _e === void 0 ? void 0 : _e._id) === question.user._id)) return [3 /*break*/, 4];
                // create a notification for admin
                return [4 /*yield*/, notification_model_1.default.create({
                        user: (_f = req.user) === null || _f === void 0 ? void 0 : _f._id,
                        title: "New question reply",
                        message: "You  have a new reply in ".concat(course === null || course === void 0 ? void 0 : course.name, " => ").concat(courseContent.title),
                    })];
            case 3:
                // create a notification for admin
                _g.sent();
                return [3 /*break*/, 9];
            case 4:
                data = {
                    name: question.user.name,
                    title: courseContent.title,
                };
                return [4 /*yield*/, ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/question-reply.ejs"), data)];
            case 5:
                html = _g.sent();
                _g.label = 6;
            case 6:
                _g.trys.push([6, 8, , 9]);
                return [4 /*yield*/, (0, sendMail_1.default)({
                        email: question.user.email,
                        subject: "Question Reply",
                        template: "question-reply.ejs",
                        data: data,
                    })];
            case 7:
                _g.sent();
                return [3 /*break*/, 9];
            case 8:
                error_7 = _g.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_7.message, 500))];
            case 9:
                res.status(200).json({
                    success: true,
                    course: course,
                });
                return [3 /*break*/, 11];
            case 10:
                error_8 = _g.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_8.message, 500))];
            case 11: return [2 /*return*/];
        }
    });
}); });
exports.AddReview = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userCourseList, courseId_2, courseExist, course, _a, review, rating, newReview, avg_1, notification, error_9;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 4, , 5]);
                userCourseList = (_b = req.user) === null || _b === void 0 ? void 0 : _b.courses;
                courseId_2 = req.params.id;
                courseExist = userCourseList === null || userCourseList === void 0 ? void 0 : userCourseList.find(function (course) { return course._id.toString() === courseId_2.toString(); });
                if (!courseExist) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Please buy the course first :)", 404))];
                }
                return [4 /*yield*/, course_model_1.default.findById(courseId_2)];
            case 1:
                course = _e.sent();
                _a = req.body, review = _a.review, rating = _a.rating;
                newReview = {
                    user: req === null || req === void 0 ? void 0 : req.user,
                    comment: review,
                    rating: rating,
                };
                //add review to course
                course === null || course === void 0 ? void 0 : course.reviews.push(newReview);
                avg_1 = 0;
                course === null || course === void 0 ? void 0 : course.reviews.forEach(function (review) {
                    avg_1 += review.rating;
                });
                if (course)
                    course.ratings = avg_1 / (course === null || course === void 0 ? void 0 : course.reviews.length);
                return [4 /*yield*/, (course === null || course === void 0 ? void 0 : course.save())];
            case 2:
                _e.sent();
                notification = {
                    title: "New Review Received",
                    message: "".concat((_c = req.user) === null || _c === void 0 ? void 0 : _c.name, " has given a review on ").concat(course === null || course === void 0 ? void 0 : course.name),
                };
                //TODO:create notification
                return [4 /*yield*/, notification_model_1.default.create({
                        user: (_d = req.user) === null || _d === void 0 ? void 0 : _d._id,
                        notification: notification,
                    })];
            case 3:
                //TODO:create notification
                _e.sent();
                res.status(200).json({
                    success: true,
                    course: course,
                });
                return [3 /*break*/, 5];
            case 4:
                error_9 = _e.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_9.message, 500))];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.AddReviewReply = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, comment, courseId, reviewId_1, course, review, newReply, error_10;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                _a = req.body, comment = _a.comment, courseId = _a.courseId, reviewId_1 = _a.reviewId;
                return [4 /*yield*/, course_model_1.default.findById(courseId)];
            case 1:
                course = _d.sent();
                if (!course) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Course not found", 500))];
                }
                review = (_b = course === null || course === void 0 ? void 0 : course.reviews) === null || _b === void 0 ? void 0 : _b.find(function (review) { return review._id.toString() === reviewId_1; });
                if (!review) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Review not found", 500))];
                }
                newReply = {
                    user: req.user,
                    comment: comment,
                };
                if (!review.commentReplies)
                    review.commentReplies = [];
                (_c = review.commentReplies) === null || _c === void 0 ? void 0 : _c.push(newReply);
                return [4 /*yield*/, course.save()];
            case 2:
                _d.sent();
                res.status(200).json({
                    success: true,
                    course: course,
                });
                return [3 /*break*/, 4];
            case 3:
                error_10 = _d.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_10.message, 500))];
            case 4: return [2 /*return*/];
        }
    });
}); });
//get all courses
exports.getCoursesAll = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            (0, course_service_1.getCourses)(res);
        }
        catch (error) {
            return [2 /*return*/, next(new ErrorHandler_1.default(error.message, 500))];
        }
        return [2 /*return*/];
    });
}); });
//delete course --admin
exports.deleteCourse = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, course, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                id = req.params.id;
                return [4 /*yield*/, course_model_1.default.findById(id)];
            case 1:
                course = _a.sent();
                if (!course) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Course not found", 404))];
                }
                return [4 /*yield*/, course.deleteOne({ id: id })];
            case 2:
                _a.sent();
                return [4 /*yield*/, redis_1.redis.del(id)];
            case 3:
                _a.sent();
                res.status(200).json({
                    success: true,
                    message: "Course deleted successfully",
                });
                return [3 /*break*/, 5];
            case 4:
                error_11 = _a.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_11.message, 500))];
            case 5: return [2 /*return*/];
        }
    });
}); });
