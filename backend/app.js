import express from "express";
import cors from "cors";
import userModel from "./models/user.js";
import postModel from "./models/post.js";
import commentRoutes from "./routes/commentRoutes.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import isLogin from "./middleware/isLogin.js";
import * as dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const secretKey = process.env.SECRET_KEY;

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("MongoDB URI is not defined!");
  process.exit(1);
}

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend
    credentials: true,
  })
);

app.get("/dashboard", isLogin, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}!` });
  console.log(req.user);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/addData", async (req, res) => {
  try {
    const { data } = req.body;
    console.log(data);

    const existUser = await userModel.findOne({ email: data.email });
    console.log(existUser);

    if (existUser) {
      return res
        .status(200)
        .json({ success: false, message: "user already Exists", existUser });
    } else {
      const hash = await bcrypt.hash(data.password, 10);

      const user = await userModel.create({
        username: data.name,
        email: data.email,
        password: hash,
      });

      res
        .status(200)
        .json({ success: true, message: "user Created Successfully", user });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const data  = req.body;
    console.log(data);

    const user = await userModel.findOne({ email: data.email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, secretKey);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      // maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/addPost", isLogin, async (req, res) => {
  try {
    const data  = req.body;

    const post = await postModel.create({
      title: data.title,
      content: data.content,
    });

    res.json({ success: true, message: "Post Created Successfully", post });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Server Error" });
  }
});

app.get("/me", isLogin, (req, res) => {
  res.json({ success: true, user: req.user });
});

app.get("/posts", async (req, res) => {
    try{
      const posts = await postModel.find().sort({ createdAt : -1});
      res.json(posts);
  } catch (err){
    console.log(err);
    res.status(500).json({ message: "Error fetching posts" });
  }
})

app.delete("/postDelete/:id",isLogin, async (req, res) => {
  try{
    const {id} = req.params;
    const post = await postModel.findByIdAndDelete(id);
    if(post){
      res.json({success: true, message: "User Deleted Succesfully"});
    } else {
      res.json({success: false, message: "server error"});
    }
    console.log(post);
  } catch (err) {
    console.log(err);
  }
})

app.put("/postEdit/:id", isLogin, async (req, res) => {
  try{
    const { id } = req.params;
    const { title, content, image } = req.body;

    const updatedPost = await postModel.findByIdAndUpdate(
      id,
      { title, content, image },
      { new: true } 
    );

    if (!updatedPost) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    res.json({ success: true, message: "Post updated successfully", post: updatedPost });
  } catch (err) {
    console.log(err);
  }
})

// app.post("/addComment", isLogin, (req, res) => {
//   const comt = req.body;
//   console.log(comt);
// })

app.use("/api", commentRoutes);

app.post("/logout", (req, res) => {
  console.log(req.cookies);
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
