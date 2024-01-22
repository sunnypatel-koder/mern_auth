import express from "express";
import { test, updateUser } from "../controllers/user.controller.js";
// import { verifiyToken } from "../utils/verifiyUser.js";
// verifiyToken,

const router = express.Router();

router.get("/", test);
router.post("/update/:id", updateUser);

export default router;

//
