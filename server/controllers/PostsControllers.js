import Posts from "../models/PostsModels.js";
import Comments from "../models/CommentsModels.js";

export const getPosts = async (req, res) => {
  try {
    const post = await Posts.find()
      .select("author body imageUrl comments")
      .populate({
        path: "comments",
        select: "body author",
      })
      .sort("-date");
    res.status(200).json(post);
  } catch (error) {
    console.log(error.message);
  }
};

export const getPostsById = async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    res.status(200).json(post);
  } catch (error) {
    console.log(error.message);
  }
};

export const createPosts = async (req, res) => {
  const { body, imageUrl } = req.body;

  if (!body || body.trim().length < 1)
    return res.status(400).json({ msg: "Cannot send this post" });

  try {
    await Posts.create({
      userId: req.userId,
      author: req.username,
      body,
      imageUrl,
    });

    res.status(201).json({ msg: "Post uploaded" });
  } catch (error) {
    console.log(error.message);
  }
};

export const updatePosts = async (req, res) => {
  const { body } = req.body;

  try {
    const post = await Posts.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (post.userId.toString() != req.userId) return res.sendStatus(403);

    post.body = body;
    await post.save();

    res.status(201).json({ msg: "Update post succesfully" });
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
    await Comments.deleteMany({ postId: req.params.id });
    res.status(200).json({ msg: "Post deleted" });
  } catch (error) {
    console.log(error.message);
  }
};
