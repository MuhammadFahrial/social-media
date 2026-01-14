import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Layout from "layout/Layout";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { verifyToken } from "lib/utils";

const DetailPosts = () => {
  const [author, setAuthor] = useState("");
  const [imageAuthor, setImageAuthor] = useState("");
  const [body, setBody] = useState("");
  const [comments, setComments] = useState([]);
  const [imageComments, setImageComments] = useState("");
  const [textComment, setTextComment] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    checkValidation();
    getPosts();
    getComments();
  }, [id]);

  const checkValidation = async () => {
    const token = localStorage.getItem("token");

    const decode = jwtDecode(token);
    setImageComments(decode.image);

    if (verifyToken(token) === false) {
      localStorage.removeItem("token");
      return navigate("/login");
    }
  };

  const getPosts = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_URL}/v1/posts/${id}`
    );
    setAuthor(response.data.author);
    setImageAuthor(response.data.image);
    setBody(response.data.body);
  };

  const getComments = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_URL}/v1/comments/${id}`
    );
    setComments(response.data.comments);
  };

  const addComment = async (postId, e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not logged in");
      return navigate("/login");
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_URL}/v1/comments/${postId}`,
        {
          body: textComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("comment uploaded");
      setTextComment("");
      getComments(); // Refresh post untuk memuat komentar terbaru
    } catch (error) {
      console.log(error.response?.data?.msg);
    }
  };

  return (
    <Layout>
      <div className="post-content">
        <div className="post-style ">
          <div className="post-header">
            <img
              src={imageAuthor}
              alt=""
              className="post-img-detail "
            />
            <h1>{author}</h1>
          </div>
          <p>{body}</p>

          {/* Form Add Comment */}
          <div className="form-comment">
            <img className="post-img" src={imageComments} alt="" />
            <form
              onSubmit={(e) => addComment(id, e)}
              className="form-input-comment"
            >
              <input
                type="text"
                name="comment"
                id="comment"
                placeholder="Write your comment"
                value={textComment} // Mengikat komentar ke post tertentu
                onChange={(e) => setTextComment(e.target.value)}
              />
              <button>Send</button>
            </form>
          </div>

          <div>
            {comments.map((comment, index) => (
              <div key={index} className="comment">
                <img src={comment.image} alt="" />
                <div className="comment-text">
                  <p className="comment-author">{comment.author}</p>
                  <p className="comment-body">{comment.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>{" "}
      </div>
    </Layout>
  );
};

export default DetailPosts;
