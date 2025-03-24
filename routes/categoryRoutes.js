const express = require("express");
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, createCategory);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.put("/:id", authMiddleware, updateCategory);
router.delete("/:id", authMiddleware, deleteCategory);

module.exports = router;
