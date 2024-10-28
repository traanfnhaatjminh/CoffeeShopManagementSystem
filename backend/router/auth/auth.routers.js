const express = require("express");
const authController = require("../../controllers/auth/auth-controller");
const protectRouter = require("../../middlewares/protect-router");

const router = express.Router();
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);
router.post("/changePassword", authController.updatePassword);
router.get("/checkAuth", protectRouter, authController.checkAuthor);
router.post("/register", protectRouter, authController.register);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword", authController.resetPassword);
router.post("/verifyOTP", authController.verifyOTP);
module.exports = router;
