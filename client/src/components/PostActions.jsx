const PostActions = ({ postId, isOwner, onEdit, onDelete }) => {
  if (!isOwner) return null;

  return (
    <div className="post-actions-btns">
      <button className="btn-edit" onClick={onEdit}>
        Edit
      </button>
      <button className="btn-delete" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
};

export default PostActions;
