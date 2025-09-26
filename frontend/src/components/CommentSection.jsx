import React, { useState, useEffect } from "react";
import axios from "axios";

const CommentSection = ({ postId, isLoggedIn }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/comments/${postId}`,
        { withCredentials: true }
      );
      if (res.data.success) setComments(res.data.comments);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !isLoggedIn) return;

    try {
      const res = await axios.post(
        `http://localhost:3000/api/addComment/${postId}`,
        { content: newComment },
        { withCredentials: true }
      );

      if (res.data.success) {
        setComments([res.data.comment, ...comments]); // prepend new comment
        setNewComment("");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  return (
    <>
      <div className="mt-4 border-t pt-3">
      <h3 className="font-bold mb-2 text-gray-800">Comments</h3>

      {/* Input box */}
      <div className="flex gap-2 mb-3 flex-col sm:flex-row">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={isLoggedIn ? "Write a comment..." : "Login to add a comment"}
          className={`border p-2 flex-grow rounded focus:outline-none focus:ring-2 ${
            isLoggedIn ? "focus:ring-blue-500" : "bg-gray-100 cursor-not-allowed"
          }`}
          disabled={!isLoggedIn}
        />
        <button
          onClick={handleAddComment}
          className={`px-4 py-2 rounded text-white transition-colors ${
            isLoggedIn ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!isLoggedIn}
        >
          Post
        </button>
      </div>

      {/* Comments list */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {comments.length > 0 ? (
          comments.map((c) => (
            <div key={c._id} className="p-2 border-b last:border-none">
              <p className="text-sm">
                <span className="font-semibold text-gray-700">
                  {c.author?.username || "Anonymous"}:
                </span>{" "}
                <span className="text-gray-800">{c.content}</span>
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No comments yet.</p>
        )}
      </div>
    </div>
    </>
    
  );
};

export default CommentSection;


