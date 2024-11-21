import React from "react";
import Navbar from "../header";

const Layout = ({ children }) => {
  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main>{children}</main>
      {/* <footer>this is footer</footer> */}
    </div>
  );
};

export default Layout;
