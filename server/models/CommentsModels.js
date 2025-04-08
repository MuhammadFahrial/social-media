import mongoose from "mongoose";

const { Schema } = mongoose;

const Comments = new Schema({
  body: String,
  date: { type: Date, default: Date.now },
  author: { type: String, required: true },
  image: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Posts" },
});

export default mongoose.model("Comments", Comments);
