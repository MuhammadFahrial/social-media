import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "layout/Layout";
import { verifyToken } from "lib/utils";
import { useFavorites } from "lib/useFavorites";

const Favorites = () => {
  const navigate = useNavigate();
  const { favorites, removeFavorite } = useFavorites();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    if (verifyToken(token) === false) {
      localStorage.removeItem("token");
      return navigate("/login");
    }
  }, []);

  const getAuthorName = (author) =>
    Array.isArray(author) ? author.join(", ") : (author ?? "");

  return (
    <Layout>
      <div className="post-content">
        <h2 className="page-title">Favorites</h2>

        {favorites.length === 0 ? (
          <div className="empty-state">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#dbdbdb"
              width="64"
              height="64"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <p>No favorites yet.</p>
            <span>Tap the heart on any post to save it here.</span>
          </div>
        ) : (
          favorites.map((post, i) => (
            <div className="post-style" key={i}>
              <div className="post-header">
                <img src={post.image} alt="" className="post-img" />
                <p className="post-author">{getAuthorName(post.author)}</p>
              </div>
              <p className="post-body">{post.body}</p>
              <div className="post-actions-row">
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
                  <span style={{ fontSize: "0.8125rem" }}>View post</span>
                </Link>
                <button
                  className="btn-favorite active"
                  onClick={() => removeFavorite(post._id)}
                  title="Remove from favorites"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default Favorites;
