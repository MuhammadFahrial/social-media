import Users from "../models/UsersModels.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT;

export const Register = async (req, res) => {
  const { username, email, password, confPassword } = req.body;

  if (!req.file) {
    res.status(400).json({ error: true, message: "No image uploaded" });
  }
  const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;

  const usernameCheck = await Users.findOne({ username: username });
  if (usernameCheck)
    return res.status(409).json({
      msg: "Username already taken. Please choose a different username",
    });

  const emailCheck = await Users.findOne({ email: email });
  if (emailCheck)
    return res.status(409).json({
      msg: "Email already taken. Please choose a different email",
    });

  if (!password) return res.status(400).json({ msg: "Require password" });

  if (password != confPassword) {
    return res
      .status(400)
      .json({ msg: "Password and confirm password not same" });
  }
  const hashPassword = await argon2.hash(password);

  let { role } = req.body;
  if (role != "admin") role = "users";

  try {
    await Users.create({
      username: username,
      email: email,
      password: hashPassword,
      role: role,
      image: imageUrl,
    });
    res.status(201).json({ msg: "Registration success" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || email.trim().length < 1)
    return res.status(400).json({ msg: "Require email" });

  if (!password || password.trim().length < 1)
    return res.status(400).json({ msg: "Require password" });

  try {
    const user = await Users.findOne({ email: email });

    if (!user) return res.status(404).json({ msg: "User not found" });
    const match = await argon2.verify(user.password, password);
    if (!match) return res.status(400).json({ msg: "Wrong password" });

    const accessToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        image: user.image,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30m",
      }
    );
    res.cookie("token", accessToken, {
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
    });
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: "User not found" });
  }
};

export const Logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ msg: "Logout success" });
};

export const getUsers = async (req, res) => {
  try {
    const response = await Users.find().select("username image");
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getUsersById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Users.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Error fetching users", error: error.message });
  }
};

export const getUsersByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await Users.findOne({ username: username }).select("username");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Error fetching users", error: error.message });
  }
};
