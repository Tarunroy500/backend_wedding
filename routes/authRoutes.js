const express = require("express");
const { adminLogin, registerAdmin, forgotPassword } = require("../controllers/authController");
const router = express.Router();

router.post("/login", adminLogin);
router.post("/register", registerAdmin);
router.post("/forgot-password", forgotPassword);

module.exports = router;
