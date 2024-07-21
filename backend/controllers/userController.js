import User from "../models/User.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";

// get-current-user-profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    return res.status(400).json({ message: "User not found" });
  }
});

// update-current-user-profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updateUser = await user.save();
    res.status(200).json({
      _id: updateUser._id,
      name: updateUser.name,
      username: updateUser.username,
      email: updateUser.email,
    });
  } else {
    return res.status(400).json({ message: "User not found" });
  }
});

// delete-current-user-profile
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    await user.deleteOne();
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({ message: "User deleted successfully" });
  } else {
    return res.status(400).json({ message: "User not found " });
  }
});

// signup-user
const signupUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required " });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hashing
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({ name, email, password: hashedPassword });
  try {
    await newUser.save();
    createToken(res, newUser._id);
    res.status(200).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Failed to create user, invalid data" });
  }
});

// signin-user
const signinUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      createToken(res, user._id);
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      return res.status(400).json({ message: "Invalid password or email" });
    }
  } else {
    return res.status(400).json({ message: "Failed to sign account" });
  }
});

// signout-user
const signoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

export {
  getUserProfile,
  updateUserProfile,
  deleteUser,
  signupUser,
  signinUser,
  signoutUser,
};
