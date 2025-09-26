import React, { useState, useEffect } from "react";
import CommentSection from "./CommentSection";
import axios from "axios";

const Index = () => {
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    image: "",
  });

  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editPost, setEditPost] = useState(null);
  // const [comment, setComment] = useState();

  useEffect(() => {
    axios
      .get("http://localhost:3000/posts", { withCredentials: true })
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/me", { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          setIsLoggedIn(true);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
      });
  }, []);

  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id) => {
    try {
      const result = await axios.delete(
        `http://localhost:3000/postDelete/${id}`,
        { withCredentials: true }
      );

      if (result.data.success) {
        alert(result.data.message);
        setPosts((prev) => prev.filter((post) => post._id !== id));
      } else {
        alert(result.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (post) => {
    setEditPost(post);
    setPostData({
      title: post.title,
      content: post.content,
      image: post.image,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editPost) {
        const result = await axios.put(
          `http://localhost:3000/postEdit/${editPost._id}`,
          postData,
          { withCredentials: true }
        );

        if (result.data.success) {
          setPosts((prev) =>
            prev.map((p) => (p._id === editPost._id ? result.data.post : p))
          );
          alert(result.data.message);
        }

        setEditPost(null);
      } else {
        const result = await axios.post(
          "http://localhost:3000/addPost",
          postData,
          { withCredentials: true }
        );

        if (result.data.success) {
          setPosts((prev) => [result.data.post, ...prev]);
          alert(result.data.message);
        }
      }

      setPostData({ title: "", content: "", image: "" });
    } catch (err) {
      console.log(err);
      alert("server error");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/logout",
        {},
        { withCredentials: true }
      );
      setIsLoggedIn(false);
      alert("Logged out successfully");
    } catch (err) {
      console.log(err);
    }
  };

  // const handleComment = (e) => {
  //   setComment(e.target.value);
  // }

  // const handleCommentButton = async () =>{
  //   try{
  //     await axios.post(`http://localhost:3000/addComment`, comment, { withCredentials: true})
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  return (
    <>
        <div className="min-h-screen bg-gray-100">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200 px-6 py-3 flex justify-end">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow transition duration-200"
          >
            Logout
          </button>
        ) : (
          <a
            href="/login"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow transition duration-200"
          >
            Login
          </a>
        )}
      </div>

      {/* Page Content */}
      <div className="pt-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Create Post Form */}
        {isLoggedIn && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 sm:p-8 mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 text-center">
              {editPost ? "Update Post" : "Create Post"}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col">
                <label htmlFor="title" className="mb-1 text-gray-700 font-semibold">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={postData.title}
                  onChange={handleChange}
                  placeholder="Enter title"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="content" className="mb-1 text-gray-700 font-semibold">
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={postData.content}
                  onChange={handleChange}
                  placeholder="Write your content here..."
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                >
                  {editPost ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts Section */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <p className="text-gray-500 italic text-center">No posts yet</p>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 sm:p-8"
              >
                <h3 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-2">
                  @{post.title}
                </h3>
                <p className="text-gray-700 mb-4">{post.content}</p>

                {isLoggedIn && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow transition duration-200"
                      onClick={() => handleEdit(post)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg shadow transition duration-200"
                      onClick={() => handleDelete(post._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}

                {/* Comment Section */}
                <CommentSection postId={post._id} isLoggedIn={isLoggedIn} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Index;
