import express from "express";
import {
  signin,
  createUser,
  createFirstUser,
  protectRoute,
  isSignedin,
  updatedPassword,
  changeTheme,
  signout,
  getAllUsers,
  admin,
  info,
  removeUser,
  updatedUser,
  getImagesAndPredictions,
} from "../Controllers/userController.js";

const router = express.Router({ mergeParams: true });

router.post("/signin", signin);
router.post("/createFirst", createFirstUser);

// Protected routes
router.get("/", protectRoute, info);
router.post("/auth", protectRoute, isSignedin);
router.post("/updatedPassword", protectRoute, updatedPassword);
router.post("/changeTheme", protectRoute, changeTheme);
router.post("/signout", protectRoute, signout);
router.get("/getImagesAndPredictions", protectRoute, getImagesAndPredictions);

// Admin only
router.post("/getAllUsers", protectRoute, admin, getAllUsers);
router.post("/create", protectRoute, admin, createUser);
router.post("/remove", protectRoute, admin, removeUser);
router.post("/update", protectRoute, admin, updatedUser);

export default router;
