import { Router } from "express";
import { loginUser, registerUser, setScore } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post( registerUser)

router.route("/login").post(loginUser);
router.route("/setScore").post(setScore);

export default router;