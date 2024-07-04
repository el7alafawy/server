"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourses = exports.createCourse = void 0;
const course_model_1 = __importDefault(require("../models/course.model"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const redis_1 = require("../utils/redis");
// create course
exports.createCourse = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(async (data, res) => {
    const course = await course_model_1.default.create(data);
    const courses = await course_model_1.default.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
    await redis_1.redis.set("allCourses", JSON.stringify(courses));
    res.status(201).json({
        success: true,
        course,
    });
});
//get all courses
const getCourses = async (res) => {
    const courses = await course_model_1.default.find().sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        courses,
    });
};
exports.getCourses = getCourses;
