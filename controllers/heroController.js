const Hero = require("../models/Hero");

exports.createHero = async (req, res) => {
    try {
        const { imageUrl, order } = req.body;
        const newHero = new Hero({ imageUrl, order });
        await newHero.save();
        res.status(201).json(newHero);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getHeroes = async (req, res) => {
    const heroes = await Hero.find().sort({ order: 1 });
    res.json(heroes);
};

exports.getHeroById = async (req, res) => {
    try {
        const hero = await Hero.findById(req.params.id);
        if (!hero) {
            return res.status(404).json({ message: "Hero not found" });
        }
        res.json(hero);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateHero = async (req, res) => {
    try {
        const { imageUrl, order } = req.body;
        const hero = await Hero.findByIdAndUpdate(req.params.id, { imageUrl, order }, { new: true });
        res.json(hero);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteHero = async (req, res) => {
    try {
        await Hero.findByIdAndDelete(req.params.id);
        res.json({ message: "Hero deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
