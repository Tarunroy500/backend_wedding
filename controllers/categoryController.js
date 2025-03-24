const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
    try {
        const { name, order } = req.body;
        const newCategory = new Category({ name, order });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCategories = async (req, res) => {
    const categories = await Category.find().sort({ order: 1 });
    res.json(categories);
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { name, order } = req.body;
        const category = await Category.findByIdAndUpdate(req.params.id, { name, order }, { new: true });
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
