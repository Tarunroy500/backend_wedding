const express = require("express");
const { createImage, getImages, getImageById, updateImage, deleteImage, bulkUploadImages } = require("../controllers/imageController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const router = express.Router();

// Use multer middleware for file upload
router.post("/", authMiddleware, upload.single('image'), createImage);
router.post("/bulk", authMiddleware, upload.array('images', 20), bulkUploadImages); // New bulk upload route
router.get("/", getImages);
router.get("/album/:albumId", getImages); // Route for album-specific images
router.get("/:id", getImageById);
router.put("/:id", authMiddleware, updateImage);
router.delete("/:id", authMiddleware, deleteImage);

module.exports = router;
