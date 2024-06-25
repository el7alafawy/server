import { Response } from "express";
import CourseModel from "../models/course.model";
import { CatchAsyncMiddleware } from "../middleware/catchAsyncErrors";
// create course
export const createCourse = CatchAsyncMiddleware(
  async (data: any, res: Response) => {
    const course = await CourseModel.create(data);
    res.status(201).json({
      success: true,
      course,
    });
  }
);
//get all users 
export const getCourses = async (res: Response) => {
  const courses = await CourseModel.find().sort({createdAt:-1});
  res.status(201).json({
    success: true,
    courses,
  });
}