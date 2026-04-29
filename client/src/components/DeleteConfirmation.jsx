import { useState } from "react";
import axios from "axios";

const DeleteConfirmation = ({ postId, onConfirm, onClose }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      await axios.delete(`${process.env.REACT_APP_URL}/v1/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onConfirm(postId);
      onClose();
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) setError("Post tidak ditemukan");
      else setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Delete Post</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <p className="modal-confirm-text">
            Are you sure you want to delete this post?{" "}
            <span>This action cannot be undone.</span>
          </p>
          {error && <p className="modal-error">{error}</p>}
        </div>
        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="modal-btn-delete"
            onClick={handleConfirmDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
