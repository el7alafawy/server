import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model";

interface IComment extends Document {
  user: IUser;
  comment: string;
  commentReplies?: IComment[];
}
interface IReview extends Document {
  user: IUser;
  rating: number;
  comment: string;
  commentReplies?: IComment[];
}
interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  estimatedPrice?: number;
  thumbnail: object;
  images: [object];
  tags: string;
  level: string;
  reviews: IReview[];
  ratings?: number;
  purchased?: number;
}
const reviewSchema = new Schema<IReview>({
  user: Object,
  rating: {
    type: Number,
    default: 0,
  },
  comment: String,
  commentReplies:[Object],
});
const commentSchema = new Schema<IComment>({
  user: Object,
  comment: String,
  commentReplies: [Object],
});

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  estimatedPrice: {
    type: Number,
  },
  thumbnail: {
    public_id: {
      // required: true,
      type: String,
    },
    url: {
      // required: true,
      type: String,
    },
  },
  images: [{
    public_id: {
      // required: true,
      type: String,
    },
    url: {
      // required: true,
      type: String,
    },
  }],
  tags: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  reviews: [reviewSchema],
  ratings: {
    type: Number,
    default: 0,
  },
  purchased: {
    type: Number,
    default: 0,
  },
},{timestamps:true});

const ProductModel: Model<IProduct> = mongoose.model("Products", productSchema);
export default ProductModel;
