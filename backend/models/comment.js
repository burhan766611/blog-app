import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "userModel" },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "postModel" },
}, { timestamps: true });

const Comment = mongoose.model("commentModel", commentSchema);

export default Comment;

