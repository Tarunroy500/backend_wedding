const express = require("express");
const { createImage, getImages, getImageById, updateImage, deleteImage } = require("../controllers/imageController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const router = express.Router();

// Use multer middleware for file upload
router.post("/", authMiddleware, upload.single('image'), createImage);
router.get("/", getImages);
router.get("/:id", getImageById);
router.put("/:id", authMiddleware, updateImage);
router.delete("/:id", authMiddleware, deleteImage);

module.exports = router;
