import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import avatar1 from "../../../assets/avatar1.png";
import avatar3 from "../../../assets/avatar3.png";
import commentIcon from "../../../assets/comment.png";
import Layout from "../../template";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [textPosts, setTextPosts] = useState("");
  const [comments, setComments] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    checkValidation();
    getPost();
  }, []);

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

  const getPost = async () => {
    const response = await axios.get(`${process.env.REACT_APP_URL}/v1/posts`);
    setPosts(response.data);
    // console.log(response.data);
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
        }
      );
      console.log("upload success");
      getPost();
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
        }
      );
      console.log("comment uploaded");
      setComments((prev) => ({
        ...prev,
        [postId]: "", // Reset komentar untuk post yang bersangkutan
      }));
      getPost(); // Refresh post untuk memuat komentar terbaru
    } catch (error) {
      console.log(error.response?.data?.msg);
    }
  };

  return (
    <Layout>
      <div className="post-content">
        {/*START FORM INPUT */}
        <div>
          <form onSubmit={addPost} className="form-post">
            <textarea
              className="input-form-post"
              type="text"
              placeholder="What's on your mind"
              value={textPosts}
              onChange={(e) => setTextPosts(e.target.value)}
              required
            />
            <div>
              <button className="form-btn">Post</button>
            </div>
          </form>
        </div>
        {/*END FORM INPUT */}

        {/*START POST */}
        {posts.map((post, index) => (
          <div className="post-style" key={index}>
            <div className="post-header">
              <img className="post-img" src={avatar1} alt="" />
              <p className="post-author">{post.author}</p>
            </div>
            <div>
              <p>{post.body}</p>
            </div>
            <div>
              {post.comments.length === 0 ? (
                <Link to={`/posts/${post._id}`} className="post-comment-icon">
                  <img src={commentIcon} alt="" />
                  <div className="post-comment">
                    <p>No</p>
                    <p>Comment</p>
                  </div>
                </Link>
              ) : (
                <Link to={`/posts/${post._id}`} className="post-comment-icon">
                  <img src={commentIcon} alt="" />
                  <div className="post-comment">
                    <p>{post.comments.length}</p>
                    <p>Comment</p>
                  </div>
                </Link>
              )}
            </div>

            {/* Form Add Comment */}
            <div className="form-comment">
              <img className="post-img" src={avatar3} alt="" />
              <form
                onSubmit={(e) => addComment(post._id, e)}
                className="form-input-comment"
              >
                <input
                  type="text"
                  name="comment"
                  id="comment"
                  placeholder="Write your comment"
                  value={comments[post._id] || ""} // Mengikat komentar ke post tertentu
                  onChange={(e) =>
                    handleCommentChange(post._id, e.target.value)
                  }
                />
                <button>Send</button>
              </form>
            </div>
          </div>
        ))}
        {/*END POST */}
      </div>
    </Layout>
  );
};

export default Home;
