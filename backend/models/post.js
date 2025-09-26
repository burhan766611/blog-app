import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  image: {
    type: String,
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "userModel" 
    },
});

const postModel = mongoose.model("postModel", postSchema);

export default postModel;
