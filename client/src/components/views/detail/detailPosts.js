import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Layout from "../../template";

const DetailPosts = () => {
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [comments, setComments] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    getPosts();
    getComments();
  }, [id]);

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

  return (
    <Layout>
      <h1>{author}</h1>
      <p>{body}</p>
      <div>
        {comments.map((comment, index) => (
          <div key={index}>
            <p>{comment.author}</p>
            <p>{comment.body}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default DetailPosts;
