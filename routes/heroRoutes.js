const express = require("express");
const { createHero, getHeroes, getHeroById, updateHero, deleteHero } = require("../controllers/heroController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, createHero);
router.get("/", getHeroes);
router.get("/:id", getHeroById);
router.put("/:id", authMiddleware, updateHero);
router.delete("/:id", authMiddleware, deleteHero);

module.exports = router;
