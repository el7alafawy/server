import express from "express";
import {
  AddQuestion,
  AddReply,
  AddReview,
  AddReviewReply,
  deleteCourse,
  editCourse,
  generateVideoUrl,
  getAllCourses,
  getCourseByAdmin,
  getCourseByUser,
  getCoursesAll,
  getSingleCourse,
  getTopCourses,
  getTopReviews,
  uploadCourse,
} from "../controllers/course.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { updateAccessToken } from "../controllers/user.controller";
const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourse
);

courseRouter.put(
  "/edit-course/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  editCourse
);

courseRouter.get("/get-course/:id", getSingleCourse);
courseRouter.get("/get-courses", getAllCourses);
courseRouter.get("/get-top-courses", getTopCourses);
courseRouter.get("/get-top-reviews", getTopReviews);
courseRouter.get(
  "/get-course-content/:id",
  updateAccessToken,
  isAuthenticated,
  getCourseByUser
);
courseRouter.get(
  "/get-course-admin/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getCourseByAdmin
);

//Question
courseRouter.put(
  "/add-question",
  updateAccessToken,
  isAuthenticated,
  AddQuestion
);
courseRouter.put("/add-reply", updateAccessToken, isAuthenticated, AddReply);
courseRouter.put(
  "/add-review/:id",
  updateAccessToken,
  isAuthenticated,
  AddReview
);
courseRouter.put(
  "/add-review-reply",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  AddReviewReply
);
courseRouter.get(
  "/get-all-courses",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getCoursesAll
);
courseRouter.post("/get-vdocipher-otp", generateVideoUrl);
courseRouter.delete(
  "/delete-course/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  deleteCourse
);

export default courseRouter;
