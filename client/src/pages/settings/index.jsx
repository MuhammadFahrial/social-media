import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Layout from "layout/Layout";
import { verifyToken } from "lib/utils";

const Settings = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    checkValidation();
  }, []);

  const checkValidation = () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    if (verifyToken(token) === false) {
      localStorage.removeItem("token");
      return navigate("/login");
    }
    const decode = jwtDecode(token);
    setUsername(decode.username || "");
    setEmail(decode.email || "");
    setImage(decode.image || "");
  };

  return (
    <Layout>
      <div className="post-content">
        <h2 className="page-title">Settings</h2>

        {/* Profile Card */}
        <div className="settings-card">
          <div className="settings-section-title">Profile</div>
          <div className="settings-profile-row">
            <img src={image} alt={username} className="settings-avatar" />
            <div>
              <p className="settings-username">{username}</p>
              <p className="settings-email">{email || "No email available"}</p>
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="settings-card">
          <div className="settings-section-title">Account</div>
          <div className="settings-item">
            <span>Username</span>
            <span className="settings-value">{username}</span>
          </div>
          <div className="settings-item">
            <span>Account type</span>
            <span className="settings-value">Personal</span>
          </div>
        </div>

        {/* Privacy */}
        <div className="settings-card">
          <div className="settings-section-title">Privacy</div>
          <div className="settings-item">
            <span>Private account</span>
            <label className="toggle">
              <input type="checkbox" />
              <span className="toggle-slider" />
            </label>
          </div>
          <div className="settings-item">
            <span>Show activity status</span>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-card">
          <div className="settings-section-title">Notifications</div>
          <div className="settings-item">
            <span>Push notifications</span>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider" />
            </label>
          </div>
          <div className="settings-item">
            <span>Email notifications</span>
            <label className="toggle">
              <input type="checkbox" />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="settings-card settings-danger">
          <div className="settings-section-title">Danger Zone</div>
          <div className="settings-item">
            <span>Delete account</span>
            <button
              className="btn-delete"
              style={{ fontSize: "0.8125rem", padding: "0.35rem 0.85rem" }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
