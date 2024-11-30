import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Layout from "../../template";
import avatar3 from "../../../assets/avatar3.png";
import { useNavigate } from "react-router-dom";

const DetailPosts = () => {
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [comments, setComments] = useState([]);
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
    if (!token) return navigate("/login");

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/verify-token`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.valid;
    } catch (error) {
      console.log(error.response.data.msg);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const getPosts = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_URL}/v1/posts/${id}`
    );
    setAuthor(response.data.author);
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
      <div className="post-style main-conten">
        <h1>{author}</h1>
        <p>{body}</p>

        {/* Form Add Comment */}
        <div className="form-comment">
          <img className="post-img" src={avatar3} alt="" />
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
              <img src={avatar3} alt="" />
              <div className="comment-text">
                <p className="comment-author">{comment.author}</p>
                <p className="comment-body">{comment.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default DetailPosts;
