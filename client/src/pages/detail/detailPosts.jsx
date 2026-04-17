import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Layout from "layout/Layout";
import { verifyToken } from "lib/utils";
import { useFavorites } from "lib/useFavorites";
import PostActions from "components/PostActions";
import EditModal from "components/EditModal";
import DeleteConfirmation from "components/DeleteConfirmation";

const DetailPosts = () => {
  const [author, setAuthor] = useState("");
  const [imageAuthor, setImageAuthor] = useState("");
  const [body, setBody] = useState("");
  const [comments, setComments] = useState([]);
  const [imageComments, setImageComments] = useState("");
  const [textComment, setTextComment] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [postUserId, setPostUserId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postData, setPostData] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    checkValidation();
    getPosts();
    getComments();
  }, [id]);

  const checkValidation = () => {
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

  const getPosts = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_URL}/v1/posts/${id}`,
    );
    const data = response.data;
    setAuthor(
      Array.isArray(data.author) ? data.author.join(", ") : data.author,
    );
    setImageAuthor(data.image);
    setBody(data.body);
    setPostUserId(data.userId?.toString());
    setPostData(data);
  };

  const handleEditSave = (postId, newBody) => {
    setBody(newBody);
    setPostData((prev) => (prev ? { ...prev, body: newBody } : prev));
  };

  const handleDeleteConfirm = () => navigate("/");

  const getComments = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_URL}/v1/comments/${id}`,
    );
    setComments(response.data.comments);
  };

  const addComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    if (!textComment.trim()) return;
    try {
      await axios.post(
        `${process.env.REACT_APP_URL}/v1/comments/${id}`,
        { body: textComment },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setTextComment("");
      getComments();
    } catch (error) {
      console.log(error.response?.data?.msg);
    }
  };

  return (
    <Layout>
      <div className="detail-wrapper">
        {/* ── Post Card ── */}
        <div className="detail-card">
          {/* Header */}
          <div className="detail-header">
            <div className="detail-author-row">
              <img src={imageAuthor} alt={author} className="detail-avatar" />
              <div className="detail-author-info">
                <span className="detail-author-name">{author}</span>
              </div>
            </div>
            <PostActions
              postId={id}
              isOwner={postUserId === currentUserId}
              onEdit={() => setShowEditModal(true)}
              onDelete={() => setShowDeleteConfirm(true)}
            />
          </div>

          {/* Body */}
          <div className="detail-body">
            <p className="detail-text">{body}</p>
          </div>

          {/* Actions row */}
          <div className="detail-actions">
            <button
              className={`btn-favorite${postData && isFavorite(postData._id) ? " active" : ""}`}
              onClick={() => postData && toggleFavorite(postData)}
              title={
                postData && isFavorite(postData._id)
                  ? "Remove from favorites"
                  : "Save"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="22"
                viewBox="0 0 24 24"
                fill={
                  postData && isFavorite(postData._id) ? "currentColor" : "none"
                }
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            <span className="detail-comment-count">
              {comments.length} {comments.length === 1 ? "comment" : "comments"}
            </span>
          </div>

          {/* Divider */}
          <div className="detail-divider" />

          {/* Comments */}
          <div className="detail-comments">
            {comments.length === 0 ? (
              <div className="detail-no-comments">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#dbdbdb"
                  strokeWidth="1.5"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <p>No comments yet.</p>
                <span>Be the first to comment.</span>
              </div>
            ) : (
              comments.map((comment, index) => (
                <div key={index} className="detail-comment-item">
                  <img
                    src={comment.image}
                    alt={comment.author}
                    className="detail-comment-avatar"
                  />
                  <div className="detail-comment-bubble">
                    <span className="detail-comment-author">
                      {comment.author}
                    </span>
                    <p className="detail-comment-body">{comment.body}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Comment input */}
          <div className="detail-comment-form">
            <img src={imageComments} alt="" className="detail-comment-me" />
            <form onSubmit={addComment} className="detail-comment-input-wrap">
              <input
                type="text"
                placeholder="Add a comment..."
                value={textComment}
                onChange={(e) => setTextComment(e.target.value)}
                className="detail-comment-input"
              />
              <button
                type="submit"
                className="detail-comment-submit"
                disabled={!textComment.trim()}
              >
                Post
              </button>
            </form>
          </div>
        </div>

        {/* Back link */}
        <Link to="/" className="detail-back-link">
          ← Back to feed
        </Link>
      </div>

      {showEditModal && (
        <EditModal
          postId={id}
          initialBody={body}
          onSave={handleEditSave}
          onClose={() => setShowEditModal(false)}
        />
      )}
      {showDeleteConfirm && (
        <DeleteConfirmation
          postId={id}
          onConfirm={handleDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
        />
      )}
    </Layout>
  );
};

export default DetailPosts;
