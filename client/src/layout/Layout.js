import React from "react";
import Navbar from "../components/Navbar";
import SideBar from "../components/Sidebar";
import Info from "../components/Info";

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
        <div className="right-side">
          <Info />
        </div>
      </div>
      {/* <footer>this is footer</footer> */}
    </div>
  );
};

export default Layout;
