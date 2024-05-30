import express from "express";
import {} from "../controllers/userControllers.js";
import { adminGuard, authGuard } from "../middleware/authMiddleware.js";
import {
  createPostCategory,
   deletePostCategory,
  getAllPostCategories,
  updatePostCategories,
} from "../controllers/postCategoriesController.js";

const router = express.Router();

router
  .route("/")
  .post(authGuard, adminGuard, createPostCategory)
  .get(getAllPostCategories);
router
  .route("/:id")
  .put(authGuard, adminGuard, updatePostCategories)
  .delete(authGuard, adminGuard, deletePostCategory);
export default router;
