import express from "express";
import { describeDocument } from "../controller/aiController.js";

const router = express.Router();

router.get("/describe-document/:id", describeDocument);

export default router;
