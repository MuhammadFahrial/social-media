import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Layout from "layout/Layout";
import { verifyToken } from "lib/utils";

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    checkValidation();
    fetchPosts();
  }, []);

  const checkValidation = () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    if (verifyToken(token) === false) {
      localStorage.removeItem("token");
      return navigate("/login");
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/v1/posts`);
      setPosts(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getAuthorName = (author) =>
    Array.isArray(author) ? author.join(", ") : (author ?? "");

  const filtered = posts.filter((p) => {
    const authorStr = getAuthorName(p.author).toLowerCase();
    const q = search.toLowerCase();
    return p.body?.toLowerCase().includes(q) || authorStr.includes(q);
  });

  return (
    <Layout>
      <div className="post-content">
        <div className="explore-header">
          <h2 className="page-title">Explore</h2>
          <div className="search-bar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="18"
              height="18"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search posts or users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>No posts found.</p>
          </div>
        ) : (
          <div className="explore-grid">
            {filtered.map((post, i) => (
              <Link to={`/posts/${post._id}`} key={i} className="explore-card">
                <div className="explore-card-header">
                  <img src={post.image} alt="" className="explore-avatar" />
                  <span className="explore-author">
                    {getAuthorName(post.author)}
                  </span>
                </div>
                <p className="explore-body">{post.body}</p>
                <div className="explore-meta">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>{post.comments?.length ?? 0} comments</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Explore;
