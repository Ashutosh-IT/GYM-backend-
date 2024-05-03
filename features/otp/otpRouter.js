import express from "express";
import { getOTP,resetPassword,verifyotp} from "./otpController.js";

const router = express.Router();

router.route("/getotp").post(getOTP);
router.route("/verifyotp").post(verifyotp);
router.route("/reset").post(resetPassword);


export default router;