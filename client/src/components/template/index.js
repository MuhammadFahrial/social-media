import React from "react";
import Navbar from "../header";
import SideBar from "../sidebar";

const Layout = ({ children }) => {
  return (
    <div className="bg-container">
      {/* <header> */}
        {/* <Navbar /> */}
      {/* </header> */}
      <div className="home">
        <div className="sidebar">
          <SideBar />
        </div>
        <div className="main-content">
          <main>{children}</main>
        </div>
        <div className="right-side">Right-Side</div>
      </div>
      {/* <footer>this is footer</footer> */}
    </div>
  );
};

export default Layout;
