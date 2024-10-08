import Users from "../models/UsersModels.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";

export const Register = async (req, res) => {
  const { username, email, password, confPassword } = req.body;

  if (password != confPassword) {
    return res
      .status(400)
      .json({ msg: "Password dan konfirmasi password tidak sama" });
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
    });
    res.status(200).json({ msg: "Registrasi berhasil" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Users.findOne({ email: email });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
    const match = await argon2.verify(user.password, password);
    if (!match) return res.status(400).json({ msg: "Password salah" });

    const accessToken = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
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
    res.status(404).json({ msg: "User tidak di temukan" });
  }
};

export const Logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ msg: "Berhasil Logout" });
};

export const getUsers = async (req, res) => {
  try {
    const response = await Users.find().select("username");
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};
