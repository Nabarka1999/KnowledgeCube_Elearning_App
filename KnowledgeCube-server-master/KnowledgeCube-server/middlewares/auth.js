import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(403).json({
        message: "You need to login",
      });
    }

    const decodeData = jwt.verify(token, process.env.jwt_sec);

    req.user = await User.findById(decodeData._id);

    next();
  } catch (error) {
    res.status(500).json({
      message: "Login first",
    });
  }
};

export const isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(400).json({
        message: "You are not an authorized person",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
