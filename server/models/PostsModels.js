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
  comments: [
    {
      body: String,
      date: Date,
      author: { type: String, required: true },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    },
  ],
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Posts", Posts);
