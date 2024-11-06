import mongoose from "mongoose";

const { Schema } = mongoose;

const Posts = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  author: { type: String, required: true },
  body: { type: String, required: true },
  imageUrl: { type: String },
  date: { type: Date, default: Date.now },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comments" }],
});

export default mongoose.model("Posts", Posts);
