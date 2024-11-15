import express from "express";
import { getUser } from "../controllers/user.controller";

const router = express.Router();

router.post("/", getUser);

export default router;
