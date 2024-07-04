"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVideoUrl = exports.deleteCourse = exports.getCoursesAll = exports.AddReviewReply = exports.AddReview = exports.AddReply = exports.AddQuestion = exports.getCourseByAdmin = exports.getCourseByUser = exports.getTopReviews = exports.getTopCourses = exports.getAllCourses = exports.getSingleCourse = exports.editCourse = exports.uploadCourse = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const course_service_1 = require("../services/course.service");
const course_model_1 = __importDefault(require("../models/course.model"));
const redis_1 = require("../utils/redis");
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const axios_1 = __importDefault(require("axios"));
// upload course
exports.uploadCourse = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(async (req, res, next) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        if (thumbnail) {
            const myCloud = await cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: "courses",
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        (0, course_service_1.createCourse)(data, res, next);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//edit Course
exports.editCourse = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(async (req, res, next) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        if (thumbnail) {
            await cloudinary_1.default.v2.uploader.destroy(thumbnail.public_id);
            const myCloud = await cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: "courses",
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        const courseId = req.params.id;
        const course = await course_model_1.default.findByIdAndUpdate(courseId, {
            $set: data,
        }, { new: true });
        const courses = await course_model_1.default.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
        await redis_1.redis.set("allCourses", JSON.stringify(courses));
        const isCacheExist = await redis_1.redis.get(courseId);
        if (isCacheExist) {
            await redis_1.redis.set(courseId, JSON.stringify(course));
        }
        res.status(201).json({
            success: true,
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//get single course --- without purchasing
exports.getSingleCourse = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const isCacheExist = await redis_1.redis.get(courseId);
        if (isCacheExist) {
            const course = JSON.parse(isCacheExist);
            res.status(200).json({
                success: true,
                course,
            });
        }
        else {
            const course = await course_model_1.default.findById(courseId).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
            await redis_1.redis.set(courseId, JSON.stringify(course), "EX", 7 * 24 * 60 * 60); //expires in 7 days |604800
            res.status(200).json({
                success: true,
                course,
            });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//get all  courses --- without purchasing
exports.getAllCourses = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(async (req, res, next) => {
    try {
        const isCacheExist = await redis_1.redis.get("allCourses");
        if (isCacheExist) {
            const courses = JSON.parse(isCacheExist);
            res.status(200).json({
                success: true,
                courses,
            });
        }
        else {
            const courses = await course_model_1.default.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
            await redis_1.redis.set("allCourses", JSON.stringify(courses));
            res.status(200).json({
                success: true,
                courses,
            });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getTopCourses = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(async (req, res, next) => {
    try {
        const courses = await course_model_1.default.find().sort({ ratings: -1 }).limit(4).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
        res.status(200).json({
            success: true,
            courses,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//Top Reviews
exports.getTopReviews = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(async (req, res, next) => {
    try {
        const isCacheExist = await redis_1.redis.get("topReviews");
        if (isCacheExist) {
            const reviews = JSON.parse(isCacheExist);
            res.status(200).json({
                success: true,
                reviews,
            });
        }
        else {
            const reviews = await course_model_1.default.find().sort({ ratings: -1 }).limit(4).select("-courseData -name -description -price -estimatedPrice -tags -level -demoUrl -benefits -prerequisites -purchased -ratings -reviews.commentReplies");
            await redis_1.redis.set("topReviews", JSON.stringify(reviews));
            res.status(200).json({
                success: true,
                reviews,
            });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//get course content --valid user
exports.getCourseByUser = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(async (req, res, next) => {
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;
        const courseExists = userCourseList?.find((course) => course._id.toString() === courseId);
        if (!courseExists) {
            return next(new ErrorHandler_1.default("Please buy the course first :)", 404));
        }
        const course = await course_model_1.default.findById(courseId);
        const content = course?.courseData;
        res.status(200).json({
            success: true,
            content,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//get course  --For Admin
exports.getCourseByAdmin = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const course = await course_model_1.default.findById(courseId);
        res.status(200).json({
            success: true,
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.AddQuestion = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(async (req, res, next) => {
    try {
        const { question, courseId, contentId } = req.body;
        const course = await course_model_1.default.findById(courseId);
        if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler_1.default("Invalid content ID", 404));
        }
        const courseContent = course?.courseData?.find((item) => item._id.equals(contentId));
        if (!courseContent) {
            return next(new ErrorHandler_1.default("Invalid content ID", 404));
        }
        //create a new question object
        const newQuestion = {
            user: req.user,
            question,
            questionReplies: [],
        };
        await notification_model_1.default.create({
            user: req.user?._id,
            title: "New Question",
            message: `You  have a new question in ${course?.name} => ${courseContent.title}`,
        });
        // add question to course content
        courseContent.questions.push(newQuestion);
        //save update course
        await course?.save();
        res.status(200).json({
            success: true,
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.AddReply = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(async (req, res, next) => {
    try {
        const { reply, courseId, contentId, questionId } = req.body;
        const course = await course_model_1.default.findById(courseId);
        if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler_1.default("Invalid content ID", 404));
        }
        const courseContent = course?.courseData?.find((item) => item._id.equals(contentId));
        if (!courseContent) {
            return next(new ErrorHandler_1.default("Invalid content ID", 404));
        }
        const question = courseContent?.questions?.find((question) => question._id.equals(questionId));
        if (!question) {
            return next(new ErrorHandler_1.default("Invalid question ID", 404));
        }
        //create new reply
        const newReply = {
            user: req.user,
            reply,
        };
        //add reply to question replies
        question?.questionReplies?.push(newReply);
        //save data to course
        await course?.save();
        if (req.user?._id === question.user._id) {
            // create a notification for admin
            await notification_model_1.default.create({
                user: req.user?._id,
                title: "New question reply",
                message: `You  have a new reply in ${course?.name} => ${courseContent.title}`,
            });
        }
        else {
            //send email to user about new answer
            const data = {
                name: question.user.name,
                title: courseContent.title,
            };
            const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/question-reply.ejs"), data);
            try {
                await (0, sendMail_1.default)({
                    email: question.user.email,
                    subject: "Question Reply",
                    template: "question-reply.ejs",
                    data,
                });
            }
            catch (error) {
                return next(new ErrorHandler_1.default(error.message, 500));
            }
        }
        res.status(200).json({
            success: true,
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.AddReview = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(async (req, res, next) => {
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;
        const courseExist = userCourseList?.find((course) => course._id.toString() === courseId.toString());
        if (!courseExist) {
            return next(new ErrorHandler_1.default("Please buy the course first :)", 404));
        }
        const course = await course_model_1.default.findById(courseId);
        const { review, rating } = req.body;
        //new Review
        const newReview = {
            user: req?.user,
            comment: review,
            rating,
        };
        //add review to course
        course?.reviews.push(newReview);
        let avg = 0;
        course?.reviews.forEach((review) => {
            avg += review.rating;
        });
        if (course)
            course.ratings = avg / course?.reviews.length;
        await course?.save();
        const notification = {
            title: "New Review Received",
            message: `${req.user?.name} has given a review on ${course?.name}`,
        };
        //TODO:create notification
        await notification_model_1.default.create({
            user: req.user?._id,
            notification,
        });
        res.status(200).json({
            success: true,
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.AddReviewReply = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(async (req, res, next) => {
    try {
        const { comment, courseId, reviewId } = req.body;
        const course = await course_model_1.default.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 500));
        }
        const review = course?.reviews?.find((review) => review._id.toString() === reviewId);
        if (!review) {
            return next(new ErrorHandler_1.default("Review not found", 500));
        }
        // new reply
        const newReply = {
            user: req.user,
            comment,
        };
        if (!review.commentReplies)
            review.commentReplies = [];
        review.commentReplies?.push(newReply);
        await course.save();
        res.status(200).json({
            success: true,
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//get all courses
exports.getCoursesAll = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(async (req, res, next) => {
    try {
        (0, course_service_1.getCourses)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//delete course --admin
exports.deleteCourse = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await course_model_1.default.findById(id);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        await course.deleteOne({ id });
        await redis_1.redis.del(id);
        const isCacheExist = await redis_1.redis.get("allCourses");
        if (isCacheExist) {
            const courses = await course_model_1.default.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
            await redis_1.redis.set("allCourses", JSON.stringify(courses));
        }
        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//generate video url
exports.generateVideoUrl = (0, catchAsyncErrors_1.CatchAsyncMiddleware)(async (req, res, next) => {
    try {
        const { videoId } = req.body;
        const response = await axios_1.default.post(`https://dev.vdocipher.com/api/videos/${videoId}/otp`, { ttl: 300 }, {
            headers: {
                Accept: "application/json",
                'Content-Type': "application/json",
                Authorization: `Apisecret ${process.env.VDO_CIPHER_API_SECRET}`,
            },
        });
        res.json(response.data);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
