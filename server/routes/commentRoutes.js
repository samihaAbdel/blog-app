

import express from "express";
const router = express.Router();
import {  authGuard } from "../middleware/authMiddleware.js";
import { createComment, deleteComment, updateComment } from "../controllers/commentContrllers.js";


router.post("/", authGuard, createComment);
router.put('/:commentId', authGuard, updateComment)
router.delete('/:commentId', authGuard, deleteComment)

export default router;
