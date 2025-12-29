import axios from "axios";

export async function getPost(data) {
  const response = await axios.get(`${process.env.REACT_APP_URL}/v1/posts`);
  data(response.data);
}

export async function verifyToken(token) {
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
  }
}
