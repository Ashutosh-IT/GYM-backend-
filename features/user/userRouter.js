import express from "express";
import { allUsers, getUser, login, register } from "./userController.js";

const router = express.Router();

router.route("/").get(allUsers);
router.route("/:email").get(getUser);
router.route("/signup").post(register);
router.route("/login").post(login);

export default router;