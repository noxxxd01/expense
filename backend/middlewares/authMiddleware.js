import jwt from "jsonwebtoken";

import User from "../models/User.js";
import asyncHandler from "./asyncHandler.js";

const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      return res.status(400).json({ message: "Not authorized, token invalid" });
    }
  } else {
    return res.status(400).json({ message: "Not authorized, no token" });
  }
});

export default authenticate;
