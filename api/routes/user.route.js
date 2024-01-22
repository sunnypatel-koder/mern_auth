import express from "express";
import { test, updateUser } from "../controllers/user.controller.js";
import { verifiyToken } from "../utils/verifiyUser.js";

const router = express.Router();

router.get("/", test);
router.post("/update/:id", verifiyToken, updateUser);

export default router;

//
