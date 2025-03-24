const express = require("express");
const { createAlbum, getAlbums, getAlbumById, updateAlbum, deleteAlbum } = require("../controllers/albumController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, createAlbum);
router.get("/", getAlbums);
router.get("/:id", getAlbumById);
router.put("/:id", authMiddleware, updateAlbum);
router.delete("/:id", authMiddleware, deleteAlbum);

module.exports = router;
