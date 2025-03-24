const Image = require("../models/Image");
const { uploadToCloudinary } = require("../services/imageServices");

exports.createImage = async (req, res) => {
    try {
        const { albumId, order } = req.body;
        
        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: "No image file provided" });
        }
        
        // Upload the image to Cloudinary
        const result = await uploadToCloudinary(req.file.buffer);
        const imageUrl = result.secure_url;
        
        // Create a new image document
        const newImage = new Image({ 
            albumId, 
            imageUrl, 
            order: order || 0 
        });
        
        await newImage.save();
        res.status(201).json(newImage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getImages = async (req, res) => {
    try {
        const { albumId } = req.query;
        let query = {};
        
        if (albumId) {
            query.albumId = albumId;
        }
        
        const images = await Image.find(query)
            .populate("albumId")
            .sort({ order: 1 });
            
        res.json(images);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getImageById = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id).populate("albumId");
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }
        res.json(image);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateImage = async (req, res) => {
    try {
        const { imageUrl, order } = req.body;
        const image = await Image.findByIdAndUpdate(req.params.id, { imageUrl, order }, { new: true });
        res.json(image);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteImage = async (req, res) => {
    try {
        await Image.findByIdAndDelete(req.params.id);
        res.json({ message: "Image deleted successfully" });
    } catch (error) {
        res.status (500).json({ error: error.message });
    }
};
