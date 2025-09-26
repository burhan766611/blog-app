import React, { useState, useEffect } from "react";
import API from "../api/axiosConfig";

const CommentSection = ({ postId, isLoggedIn }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await API.get(`/api/comments/${postId}`);
      if (res.data.success) setComments(res.data.comments);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !isLoggedIn) return;

    try {
      const res = await API.post(`/api/addComment/${postId}`, 
        { content: newComment }, 
        { withCredentials: true }
      );

      if (res.data.success) {
        setComments([res.data.comment, ...comments]);
        setNewComment("");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await API.delete(`/api/commentDelete/${id}`, { withCredentials: true });
      if (res.data.success) {
        setComments(comments.filter((c) => c._id !== id));
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const handleEdit = (c) => {
    setEditingId(c._id);
    setEditText(c.content);
  };

  const handleEditSave = async (id) => {
    if (!editText.trim()) return;

    try {
      const res = await API.put(`/api/commentEdit/${id}`, 
        { content: editText }, 
        { withCredentials: true }
      );

      if (res.data.success) {
        setComments(
          comments.map((c) => (c._id === id ? res.data.comment : c))
        );
        setEditingId(null);
        setEditText("");
      }
    } catch (err) {
      console.error("Error editing comment:", err);
    }
  };

  return (
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
            <div key={c._id} className="p-2 border-b last:border-none flex justify-between items-center">
              {editingId === c._id ? (
                <>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="border p-1 rounded flex-grow mr-2"
                  />
                  <button
                    onClick={() => handleEditSave(c._id)}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm flex-grow">
                    <span className="font-semibold text-gray-700">
                      {c.author?.username || "Anonymous"}:
                    </span>{" "}
                    <span className="text-gray-800">{c.content}</span>
                  </p>
                  {isLoggedIn && c.author?.username && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(c)}
                        className="text-blue-500 text-sm hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;



