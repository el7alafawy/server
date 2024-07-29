import mongoose, { Document, Model, Schema, mongo } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
require("dotenv").config();

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
  name: string;
  phone?:string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ courseId: string }>;
  products:Array<{ productId:string}>;
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: ()=>string;
  SignRefreshToken: ()=>string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    phone:{
      type:String,
      required:false,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "Please enter a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: String,
      },
    ],
    products: [
      {
        productId: String,
      },
    ],
  },
  { timestamps: true }
);

//Hash password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//Sign Access Token
userSchema.methods.SignAccessToken = async function () {
  const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE ||'5',10);
  return jwt.sign({id:this._id},process.env.ACCESS_TOKEN||'',{expiresIn: `${accessTokenExpire}m` });
};

//Sign Refresh Token
userSchema.methods.SignRefreshToken = async function () {
  const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE ||'7',10);

  return jwt.sign({id:this._id},process.env.REFRESH_TOKEN||'',{expiresIn: `${refreshTokenExpire}d` });
};

//Compare password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};
const userModel: Model<IUser> = mongoose.model("User", userSchema);
export default userModel