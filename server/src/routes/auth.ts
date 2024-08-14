import { Router } from "express";
import { registerUser, loginUser } from "../controllers";
import { loginValidationRules, registerValidationRules } from "../middlewares";

const router = Router();

router.post("/register", registerValidationRules(), registerUser);
router.post("/login", loginValidationRules(), loginUser);

export { router };
