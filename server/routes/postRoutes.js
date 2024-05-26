import express from "express";
const router = express.Router();
import { adminGuard, authGuard } from "../middleware/authMiddleware.js";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
} from "../controllers/postControllers.js";

router.route("/").post(authGuard, adminGuard, createPost).get(getAllPosts);
router.put("/:slug", authGuard, adminGuard, updatePost);
router.delete("/:slug", authGuard, adminGuard, deletePost);
router.get("/:slug", getPost);

export default router;
