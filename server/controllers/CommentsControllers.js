import Comments from "../models/CommentsModels.js";
import Posts from "../models/PostsModels.js";

export const getComments = async (req, res) => {
  try {
    const response = await Comments.find();
    res.status(200).json({ response });
  } catch (error) {
    console.log(error.message);
  }
};

export const getCommentByPostId = async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await Comments.find({ postId });
    if (!comments) return res.status(404).json({ msg: "Comment not found" });

    res.status(200).json({ comments });
  } catch (error) {
    console.log(error.message);
  }
};

export const createComments = async (req, res) => {
  const { body } = req.body;

  if (!body || body.trim().length < 1)
    return res.status(400).json({ msg: "Cannot send this comment" });
  try {
    const comments = await Comments.create({
      body,
      author: req.username,
      postId: req.params.id,
      userId: req.userId,
    });

    await Posts.findByIdAndUpdate(req.params.id, {
      $push: { comments: comments },
    });

    res.status(200).json({ msg: "Comment created" });
  } catch (error) {
    console.log(error.message);
  }
};

export const updateComments = async (req, res) => {
  const { body } = req.body;

  if (!body || body.trim().length < 1)
    return res.status(400).json({ msg: "Cannot send this comment" });

  const comment = await Comments.findById(req.params.id);
  if (!comment) return res.status(404).json({ msg: "Comment not found" });
  if (comment.userId.toString() != req.userId) return res.sendStatus(403);

  try {
    await Comments.findByIdAndUpdate(
      comment,
      {
        $set: { body },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({ msg: "Comment updated" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteComments = async (req, res) => {
  try {
    const comments = await Comments.findByIdAndDelete(req.params.id);
    if (!comments) return res.sendStatus(404);
    res.status(200).json({ msg: "Comment deleted" });
  } catch (error) {
    console.log(error.message);
  }
};
