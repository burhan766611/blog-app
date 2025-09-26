// routes/commentRoutes.js
import express from "express";
import Comment from "../models/comment.js";
import Post from "../models/post.js";
import isLogin from "../middleware/isLogin.js";

const router = express.Router();

// 1️⃣ Get all comments for a post
router.get("/comments/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId })
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 2️⃣ Add a comment to a post (requires login)
router.post("/addComment/:postId", isLogin, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const comment = await Comment.create({
      content,
      author: req.user.id,
      post: postId,
    });

    const populatedComment = await comment.populate("author", "username email");

    res.status(201).json({ success: true, comment: populatedComment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 3️⃣ Delete a comment (only author can delete)
router.delete("/commentDelete/:id", isLogin, async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    if (comment.author.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: "Forbidden" });

    await comment.deleteOne();
    res.json({ success: true, message: "Comment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 4️⃣ Edit a comment (only author can edit)
router.put("/commentEdit/:id", isLogin, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    if (comment.author.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: "Forbidden" });

    comment.content = content;
    await comment.save();

    const populatedComment = await comment.populate("author", "username email");
    res.json({ success: true, comment: populatedComment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;


