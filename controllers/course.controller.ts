import { NextFunction, Request, Response } from "express";
import { CatchAsyncMiddleware } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse, getCourses } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";
// upload course
export const uploadCourse = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      createCourse(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
//edit Course
export const editCourse = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        await cloudinary.v2.uploader.destroy(thumbnail.public_id);
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      const courseId = req.params.id;

      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        {
          $set: data,
        },
        { new: true }
      );

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get single course --- without purchasing
export const getSingleCourse = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
      const isCacheExist = await redis.get(courseId);
      if (isCacheExist) {
        const course = JSON.parse(isCacheExist);
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.findById(courseId).select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );
        await redis.set(
          courseId,
          JSON.stringify(course),
          "EX",
          7 * 24 * 60 * 60
        ); //expires in 7 days |604800
        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get all  courses --- without purchasing
export const getAllCourses = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCacheExist = await redis.get("allCourses");
      if (isCacheExist) {
        const courses = JSON.parse(isCacheExist);
        res.status(200).json({
          success: true,
          courses,
        });
      } else {
        const courses = await CourseModel.find().select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );
        await redis.set("allCourses", JSON.stringify(courses));
        res.status(200).json({
          success: true,
          courses,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get course content --valid user
export const getCourseByUser = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;
      const courseExists = userCourseList?.find(
        (course: any) => course._id.toString() === courseId
      );
      if (!courseExists) {
        return next(new ErrorHandler("Please buy the course first :)", 404));
      }
      const course = await CourseModel.findById(courseId);
      const content = course?.courseData;
      res.status(200).json({
        success: true,
        content,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//add questions to course
interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}
export const AddQuestion = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId }: IAddQuestionData = req.body;
      const course = await CourseModel.findById(courseId);
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content ID", 404));
      }

      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );
      if (!courseContent) {
        return next(new ErrorHandler("Invalid content ID", 404));
      }
      //create a new question object
      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };

      await NotificationModel.create({
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
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//Replies
interface IAddReplyData {
  reply: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export const AddReply = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { reply, courseId, contentId, questionId }: IAddReplyData =
        req.body;
      const course = await CourseModel.findById(courseId);
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content ID", 404));
      }

      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );
      if (!courseContent) {
        return next(new ErrorHandler("Invalid content ID", 404));
      }
      const question = courseContent?.questions?.find((question: any) =>
        question._id.equals(questionId)
      );
      if (!question) {
        return next(new ErrorHandler("Invalid question ID", 404));
      }

      //create new reply
      const newReply: any = {
        user: req.user,
        reply,
      };
      //add reply to question replies
      question?.questionReplies?.push(newReply);

      //save data to course
      await course?.save();

      if (req.user?._id === question.user._id) {
        // create a notification for admin
        await NotificationModel.create({
          user: req.user?._id,
          title: "New question reply",
          message: `You  have a new reply in ${course?.name} => ${courseContent.title}`,
        });
      } else {
        //send email to user about new answer
        const data = {
          name: question.user.name,
          title: courseContent.title,
        };
        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/question-reply.ejs"),
          data
        );
        try {
          await sendMail({
            email: question.user.email,
            subject: "Question Reply",
            template: "question-reply.ejs",
            data,
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
        }
      }
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//add review

interface IAddReviewData {
  review: string;
  courseId: string;
  rating: number;
  userId: string;
}

export const AddReview = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;

      const courseExist = userCourseList?.find(
        (course: any) => course._id.toString() === courseId.toString()
      );
      if (!courseExist) {
        return next(new ErrorHandler("Please buy the course first :)", 404));
      }
      const course = await CourseModel.findById(courseId);

      const { review, rating } = req.body as IAddReviewData;
      //new Review
      const newReview: any = {
        user: req?.user,
        comment: review,
        rating,
      };
      //add review to course
      course?.reviews.push(newReview);

      let avg = 0;
      course?.reviews.forEach((review: any) => {
        avg += review.rating;
      });

      if (course) course.ratings = avg / course?.reviews.length;

      await course?.save();

      const notification = {
        title: "New Review Received",
        message: `${req.user?.name} has given a review on ${course?.name}`,
      };

      //TODO:create notification
      await NotificationModel.create({
        user: req.user?._id,
        notification,
      });
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add reply to review
interface IAddReviewReplyData {
  comment: string;
  courseId: string;
  reviewId: string;
}
export const AddReviewReply = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, reviewId } = req.body as IAddReviewReplyData;
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 500));
      }
      const review = course?.reviews?.find(
        (review: any) => review._id.toString() === reviewId
      );
      if (!review) {
        return next(new ErrorHandler("Review not found", 500));
      }
      // new reply
      const newReply: any = {
        user: req.user,
        comment,
      };
      if (!review.commentReplies) review.commentReplies = [];
      review.commentReplies?.push(newReply);
      await course.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
//get all courses
export const getCoursesAll = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getCourses(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
//delete course --admin
export const deleteCourse = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const course = await CourseModel.findById(id);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }
      await course.deleteOne({ id });
      await redis.del(id);
      res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
