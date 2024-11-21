import React from "react";
import Layout from "../../template";
import MainContent from "./maincontent";
import SideBar from "../../sidebar";

const Home = () => {
  return (
    <Layout>
      <div className="home">
        <div className="sidebar">
          <SideBar />
        </div>
        <div className="main-content">
          <MainContent />
        </div>
        <div className="right-side">Right-Side</div>
      </div>
    </Layout>
  );
};

export default Home;
