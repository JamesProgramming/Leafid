import express from "express";
import { protectRoute } from "../Controllers/userController.js";
import {
  processImage,
  modelInfo,
  images,
} from "../Controllers/modelController.js";

const router = express.Router({ mergeParams: true });

router.get("/", modelInfo);

router.use(protectRoute);
router.post("/", processImage);
router.get("/images/:image", images);

export default router;
