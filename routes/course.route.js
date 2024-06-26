"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var course_controller_1 = require("../controllers/course.controller");
var auth_1 = require("../middleware/auth");
var courseRouter = express_1.default.Router();
courseRouter.post("/create-course", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), course_controller_1.uploadCourse);
courseRouter.put("/edit-course/:id", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), course_controller_1.editCourse);
courseRouter.get("/get-course/:id", course_controller_1.getSingleCourse);
courseRouter.get("/get-courses", course_controller_1.getAllCourses);
courseRouter.get("/get-course-content/:id", auth_1.isAuthenticated, course_controller_1.getCourseByUser);
//Question
courseRouter.put("/add-question", auth_1.isAuthenticated, course_controller_1.AddQuestion);
courseRouter.put("/add-reply", auth_1.isAuthenticated, course_controller_1.AddReply);
courseRouter.put("/add-review/:id", auth_1.isAuthenticated, course_controller_1.AddReview);
courseRouter.put("/add-review-reply", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), course_controller_1.AddReviewReply);
courseRouter.get("/get-all-courses", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), course_controller_1.getCoursesAll);
courseRouter.delete("/delete-course/:id", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), course_controller_1.deleteCourse);
exports.default = courseRouter;
