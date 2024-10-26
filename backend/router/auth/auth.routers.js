const express = require("express");
const authController = require("../../controllers/auth/auth-controller");
const protectRouter = require("../../middlewares/protect-router");

const router = express.Router();
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);
router.post("/changePassword", protectRouter, authController.updatePassword);
router.get("/checkAuth", protectRouter, authController.checkAuthor);

module.exports = router;
