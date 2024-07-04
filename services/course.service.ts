import { Response } from "express";
import CourseModel from "../models/course.model";
import { CatchAsyncMiddleware } from "../middleware/catchAsyncErrors";
import { redis } from "../utils/redis";
// create course
export const createCourse = CatchAsyncMiddleware(
  async (data: any, res: Response) => {
    const course = await CourseModel.create(data);
    const courses = await CourseModel.find().select(
      "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
    );
    await redis.set("allCourses", JSON.stringify(courses));
    res.status(201).json({
      success: true,
      course,
    });
  }
);
//get all courses
export const getCourses = async (res: Response) => {
  const courses = await CourseModel.find().sort({createdAt:-1});
  res.status(201).json({
    success: true,
    courses,
  });
}