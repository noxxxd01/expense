import express from "express";

// Controllers
import {
  deleteUser,
  getUserProfile,
  signinUser,
  signoutUser,
  signupUser,
  updateUserProfile,
} from "../controllers/userController.js";
import authenticate from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/signup").post(signupUser);
router.route("/signin").post(signinUser);
router.route("/signout").post(signoutUser);
router.route("/delete-user").delete(authenticate, deleteUser);
router
  .route("/profile")
  .get(authenticate, getUserProfile)
  .put(authenticate, updateUserProfile);

export default router;
