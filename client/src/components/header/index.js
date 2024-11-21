import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();

  const LogOut = async () => {
    try {
      localStorage.removeItem("token");
      await axios.delete(`${process.env.REACT_APP_URL}/auth/logout`);
      navigate("/login");
    } catch (e) {
      alert(e.response.data.msg);
    }
  };

  return (
    <>
      <div className="navbar">
        <div className="left-navbar">
          <p>Logo</p>
        </div>
        <div className="center-navbar">
          <a>list 1</a>
          <a>list 2</a>
          <a>list 3</a>
        </div>
        <div className="right-navbar">
          <button onClick={LogOut}>Logout</button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
