import { Router } from "express";
import { userRegisterValidator } from "../valid/index.js";
import { Validate } from "../middlewares/validator.middleware.js";

import {registerUser} from "../controllers/auth.controller.js";

const router=Router();

router.route("/register").post(userRegisterValidator(), Validate, registerUser);

export default router;