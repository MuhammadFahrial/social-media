import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Layout from "layout/Layout";

import { getPost, verifyToken } from "lib/utils";
import { useFavorites } from "lib/useFavorites";
import PostActions from "components/PostActions";
import EditModal from "components/EditModal";
import DeleteConfirmation from "components/DeleteConfirmation";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [textPosts, setTextPosts] = useState("");
  const [comments, setComments] = useState({});
  const [imageComments, setImageComments] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [deletingPostId, setDeletingPostId] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  useEffect(() => {
    checkValidation();
    getPost(setPosts);
  }, []);

  const checkValidation = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const decode = jwtDecode(token);
    setImageComments(decode.image);
    setCurrentUserId(decode.id);

    if (verifyToken(token) === false) {
      localStorage.removeItem("token");
      return navigate("/login");
    }
  };

  const handleEditSave = (postId, newBody) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === postId ? { ...p, body: newBody } : p)),
    );
  };

  const handleDeleteConfirm = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  const addPost = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not logged in");
      return navigate("/login");
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_URL}/v1/posts`,
        {
          body: textPosts,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("upload success");
      getPost(setPosts);
      setTextPosts("");
    } catch (error) {
      console.log(error.response.data.msg);
    }
  };

  const handleCommentChange = (postId, value) => {
    setComments((prev) => ({
      ...prev,
      [postId]: value, // Update komentar untuk post tertentu
    }));
  };

  const addComment = async (postId, e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not logged in");
      return navigate("/login");
    }

    const comment = comments[postId]?.trim();
    if (!comment) {
      alert("Comment cannot be empty!");
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_URL}/v1/comments/${postId}`,
        {
          body: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("comment uploaded");
      setComments((prev) => ({
        ...prev,
        [postId]: "", // Reset komentar untuk post yang bersangkutan
      }));
      getPost(setPosts); // Refresh post untuk memuat komentar terbaru
    } catch (error) {
      console.log(error.response?.data?.msg);
    }
  };

  return (
    <Layout>
      <div className="post-content">
        <form onSubmit={addPost} className="form-post">
          <textarea
            className="input-form-post"
            placeholder="What's on your mind?"
            value={textPosts}
            onChange={(e) => setTextPosts(e.target.value)}
            required
          />
          <div className="form-post-footer">
            <button className="form-btn">Post</button>
          </div>
        </form>

        {posts.map((post, index) => (
          <div className="post-style" key={index}>
            <div className="post-header">
              <img className="post-img" src={post.image} alt="" />
              <p className="post-author">{post.author}</p>
            </div>

            <p className="post-body">{post.body}</p>

            <div className="post-actions-row">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <Link to={`/posts/${post._id}`} className="post-comment-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <div className="post-comment">
                    <p>
                      {post.comments.length > 0 ? post.comments.length : "No"}
                    </p>
                    <p>{post.comments.length === 1 ? "comment" : "comments"}</p>
                  </div>
                </Link>

                <button
                  className={`btn-favorite${isFavorite(post._id) ? " active" : ""}`}
                  onClick={() => toggleFavorite(post)}
                  title={
                    isFavorite(post._id)
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={isFavorite(post._id) ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>

              <PostActions
                postId={post._id}
                isOwner={post.userId?.toString() === currentUserId}
                onEdit={() => setEditingPost({ id: post._id, body: post.body })}
                onDelete={() => setDeletingPostId(post._id)}
              />
            </div>

            <div className="form-comment">
              <img className="post-img" src={imageComments} alt="" />
              <form
                onSubmit={(e) => addComment(post._id, e)}
                className="form-input-comment"
              >
                <input
                  type="text"
                  name="comment"
                  id="comment"
                  placeholder="Add a comment..."
                  value={comments[post._id] || ""}
                  onChange={(e) =>
                    handleCommentChange(post._id, e.target.value)
                  }
                />
                <button>Post</button>
              </form>
            </div>
          </div>
        ))}
      </div>
      {editingPost !== null && (
        <EditModal
          postId={editingPost.id}
          initialBody={editingPost.body}
          onSave={handleEditSave}
          onClose={() => setEditingPost(null)}
        />
      )}
      {deletingPostId !== null && (
        <DeleteConfirmation
          postId={deletingPostId}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeletingPostId(null)}
        />
      )}
    </Layout>
  );
};

export default Home;
