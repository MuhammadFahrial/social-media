import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MainContent = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPost();
  }, []);

  const getPost = async () => {
    const response = await axios.get(`${process.env.REACT_APP_URL}/v1/posts`);
    setPosts(response.data);
  };

  const addPost = async (e) => {
    e.preventDefault();
    console.log("Uploaded");
  };

  return (
    <>
      <div>
        {/*START FORM INPUT */}
        <div>
          <form onSubmit={addPost}>
            <input type="text" placeholder="What's on your mind" />
            <button>Post</button>
          </form>
        </div>
        {/*END FORM INPUT */}

        {/*START POST */}
        {posts.map((post, index) => (
          <div key={index}>
            <p>{post.author}</p>
            <Link to={`/posts/${post._id}`}>
              <p>{post.body}</p>
            </Link>
          </div>
        ))}
        {/*END POST */}
      </div>
    </>
  );
};

export default MainContent;
