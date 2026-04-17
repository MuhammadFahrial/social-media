import { useState } from "react";
import axios from "axios";

const EditModal = ({ postId, initialBody, onSave, onClose }) => {
  const [body, setBody] = useState(initialBody);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (body.trim() === "") {
      setError("Body post tidak boleh kosong");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.patch(
        `${process.env.REACT_APP_URL}/v1/posts/${postId}`,
        { body },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onSave(postId, body);
      onClose();
    } catch (err) {
      const status = err.response?.status;
      if (status === 403) {
        setError("Anda tidak memiliki izin untuk mengedit post ini");
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Post</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What's on your mind?"
          />
          {error && <p className="modal-error">{error}</p>}
        </div>
        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="modal-btn-save"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
