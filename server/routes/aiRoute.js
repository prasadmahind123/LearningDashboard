import express from "express";
import { describeDocument , chatWithEduBot } from "../controller/aiController.js";

const router = express.Router();

router.get("/describe-document/:id", describeDocument);
router.post("/chat", chatWithEduBot);

export default router;
