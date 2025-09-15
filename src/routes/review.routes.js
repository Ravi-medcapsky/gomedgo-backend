import express from "express";
import { reviewController } from "../controllers/review.controller.js";

const router = express.Router();

router.post("/review", reviewController.create);
router.get("/get/review", reviewController.getById);
router.put("/again_review", reviewController.update);
router.delete("/delete/review", reviewController.delete);

export default router;
