"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const course_controller_1 = require("../controllers/course.controller");
const auth_1 = require("../middleware/auth");
const user_controller_1 = require("../controllers/user.controller");
const courseRouter = express_1.default.Router();
courseRouter.post("/create-course", user_controller_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), course_controller_1.uploadCourse);
courseRouter.put("/edit-course/:id", user_controller_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), course_controller_1.editCourse);
courseRouter.get("/get-course/:id", course_controller_1.getSingleCourse);
courseRouter.get("/get-courses", course_controller_1.getAllCourses);
courseRouter.get("/get-top-courses", course_controller_1.getTopCourses);
courseRouter.get("/get-top-reviews", course_controller_1.getTopReviews);
courseRouter.get("/get-course-content/:id", user_controller_1.updateAccessToken, auth_1.isAuthenticated, course_controller_1.getCourseByUser);
courseRouter.get("/get-course-admin/:id", user_controller_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), course_controller_1.getCourseByAdmin);
//Question
courseRouter.put("/add-question", user_controller_1.updateAccessToken, auth_1.isAuthenticated, course_controller_1.AddQuestion);
courseRouter.put("/add-reply", user_controller_1.updateAccessToken, auth_1.isAuthenticated, course_controller_1.AddReply);
courseRouter.put("/add-review/:id", user_controller_1.updateAccessToken, auth_1.isAuthenticated, course_controller_1.AddReview);
courseRouter.put("/add-review-reply", user_controller_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), course_controller_1.AddReviewReply);
courseRouter.get("/get-all-courses", user_controller_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), course_controller_1.getCoursesAll);
courseRouter.post("/get-vdocipher-otp", course_controller_1.generateVideoUrl);
courseRouter.delete("/delete-course/:id", user_controller_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), course_controller_1.deleteCourse);
exports.default = courseRouter;
