import Posts from "../models/PostsModels.js";

export const getPosts = async (req, res) => {
  try {
    const response = await Posts.find()
      .select("author body comments")
      .populate({
        path: "comments",
        select: "body author",
      });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const createPosts = async (req, res) => {
  const { body } = req.body;

  if (!body || body.trim().length < 1)
    return res.status(400).json({ msg: "Cannot send this post" });

  try {
    await Posts.create({
      userId: req.userId,
      author: req.username,
      body,
    });

    res.status(200).json({ msg: "Post uploaded" });
  } catch (error) {
    console.log(error.message);
  }
};

export const updatePosts = async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (post.userId.toString() != req.userId) return res.sendStatus(403);
    await Posts.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body.body,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({ msg: "Update post succesfully" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deletePosts = async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (req.role != "admin") {
      if (post.userId.toString() != req.userId) {
        return res.sendStatus(403);
      }
    }

    await Posts.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Post deleted" });
  } catch (error) {
    console.log(error.message);
  }
};
