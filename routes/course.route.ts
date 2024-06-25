import express from "express";
import {
  AddQuestion,
  AddReply,
  AddReview,
  AddReviewReply,
  deleteCourse,
  editCourse,
  getAllCourses,
  getCourseByUser,
  getCoursesAll,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourse
);

courseRouter.put(
  "/edit-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  editCourse
);

courseRouter.get("/get-course/:id", getSingleCourse);
courseRouter.get("/get-courses", getAllCourses);
courseRouter.get("/get-course-content/:id",isAuthenticated, getCourseByUser);

//Question
courseRouter.put(
  "/add-question",
  isAuthenticated,
  AddQuestion
);
courseRouter.put(
  "/add-reply",
  isAuthenticated,
  AddReply
);
courseRouter.put(
  "/add-review/:id",
  isAuthenticated,
  AddReview
);
courseRouter.put(
  "/add-review-reply",
  isAuthenticated,
  authorizeRoles("admin"),
  AddReviewReply
);
courseRouter.get(
  "/get-all-courses",
  isAuthenticated,
  authorizeRoles("admin"),
  getCoursesAll
);
courseRouter.delete(
  "/delete-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteCourse
);
export default courseRouter;
