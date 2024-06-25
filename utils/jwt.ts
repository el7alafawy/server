require("dotenv").config();
import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

//pass environment variable to integrate with fallback values
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE ||'300',10);
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE ||'1200',10);

export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 1000 * 60 ),
  maxAge: accessTokenExpire * 1000 * 60 ,
  httpOnly: true,
  sameSite: 'lax',
};
export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 1000 * 60 * 60  * 24),
  maxAge: refreshTokenExpire * 1000 * 60 * 60 *  24,
  httpOnly: true,
  sameSite: 'lax',
};

export const sendToken = async(user: IUser, statusCode: number, res: Response) => {
  const accessToken = await user.SignAccessToken();
  const refreshToken = await user.SignRefreshToken();
  //upload session to redis
  redis.set(user._id as any, JSON.stringify(user) as any);
  
  
  // only set secure in production
  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
  }

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
