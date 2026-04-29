import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import imageLogin from "assets/login-image.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const Auth = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL}/auth/login`,
        {
          email: email,
          password: password,
        },
      );
      localStorage.setItem("token", response.data.accessToken);
      alert("Login Success");
      navigate("/");
    } catch (e) {
      setError(e.response.data.msg);
      alert(error);
    }
  };

  return (
    <>
      <div className="container">
        <div className="wrapper">
          <img src={imageLogin} alt="imageLogo" className="image" />
          <form onSubmit={Auth} className="form-login">
            <h1>Log in to your Account</h1>
            <div className="textfield-email">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                name="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="textfield-password">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="action-btn">
              <button className="btn-login">Login</button>
              <Link to={"/register"} className="btn-register">
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
