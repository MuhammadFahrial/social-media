import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import icon from "../../../assets/icon.png";
import avatar1 from "../../../assets/avatar1.png";
import avatar2 from "../../../assets/avatar2.png";
import avatar3 from "../../../assets/avatar3.png";
import commentIcon from "../../../assets/comment.png";
import Layout from "../../template";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [textPosts, setTextPosts] = useState("");
  const [textComments, setTextComments] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getPost();
  }, []);

  const getPost = async () => {
    const response = await axios.get(`${process.env.REACT_APP_URL}/v1/posts`);
    setPosts(response.data);
    console.log(response.data);
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
    } catch (error) {
      console.log(error.response.data.msg);
    }
  };

  // const addComment = async (postId) => {
  //   const token = localStorage.getItem("token");

  //   if (!token) {
  //     alert("You are not logged in");
  //     return navigate("/login");
  //   }

  //   try {
  //     await axios.post(
  //       `${process.env.REACT_APP_URL}v1/comments/${postId}`,
  //       {
  //         body: textComments,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     console.log("comment uploaded");
  //   } catch (error) {
  //     console.log(error.response.data.msg);
  //   }
  // };

  return (
    <Layout>
      <div>
        {/*START FORM INPUT */}
        <div>
          <form onSubmit={addPost} className="form-post">
            <input
              className="input-form-post"
              type="text"
              placeholder="What's on your mind"
              value={textPosts}
              onChange={(e) => setTextPosts(e.target.value)}
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
              <form className="form-input-comment">
                <input
                  type="text"
                  name="comment"
                  id="comment"
                  placeholder="Write your comment"
                  value={textComments}
                  // onChange={(e) => setTextComments(e.target.value)}
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
