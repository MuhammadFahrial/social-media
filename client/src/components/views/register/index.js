import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import imageLogin from "../../../assets/login-image.jpg";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");

  const navigate = useNavigate();

  const Regist = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL}/auth/register`,
        {
          username: username,
          email: email,
          password: password,
          confPassword: confPassword,
        }
      );
      alert(response.data.msg);
      navigate("/login");
    } catch (e) {
      alert(e.response.data.msg);
    }
  };

  return (
    <>
      <div className="container">
        <div className="wrapper">
          <form onSubmit={Regist} className="form-register">
            <h1>Register</h1>
            <div className="textfield-username">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="textfield-email">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="email"
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
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="textfield-confpassword">
              <label htmlFor="confPassword">Confirm Password</label>
              <input
                type="password"
                name="confpassword"
                id="confpassword"
                placeholder="confirm password"
                value={confPassword}
                onChange={(e) => setConfPassword(e.target.value)}
                required
              />
            </div>
            <div className="action-btn">
              <Link to={"/login"} className="btn-register">
                Login
              </Link>
              <button className="btn-login">Register</button>
            </div>
          </form>
          <img src={imageLogin} alt="imageLogo" className="image" />
        </div>
      </div>
    </>
  );
}

export default Register;
