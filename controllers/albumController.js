const Album = require("../models/Album");
const Image = require("../models/Image");

exports.createAlbum = async (req, res) => {
    try {
        const { name, categoryId, coverImage, order } = req.body;
        const newAlbum = new Album({ name, categoryId, coverImage, order });
        await newAlbum.save();
        res.status(201).json(newAlbum);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAlbums = async (req, res) => {
    try {
        const { categoryId } = req.query;
        let query = {};
        
        if (categoryId) {
            query.categoryId = categoryId;
        }
        
        const albums = await Album.find(query)
            .populate("categoryId")
            .sort({ order: 1 });
            
        // For albums without a cover image, set a random image from the album
        for (let album of albums) {
            if (!album.coverImage) {
                const images = await Image.find({ albumId: album._id });
                if (images.length > 0) {
                    const randomIndex = Math.floor(Math.random() * images.length);
                    album.coverImage = images[randomIndex].imageUrl;
                    await album.save();
                }
            }
        }
        
        res.json(albums);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAlbumById = async (req, res) => {
    try {
        const album = await Album.findById(req.params.id).populate("categoryId");
        if (!album) {
            return res.status(404).json({ message: "Album not found" });
        }
        
        // If no cover image, set a random image from the album
        if (!album.coverImage) {
            const images = await Image.find({ albumId: album._id });
            if (images.length > 0) {
                const randomIndex = Math.floor(Math.random() * images.length);
                album.coverImage = images[randomIndex].imageUrl;
                await album.save();
            }
        }
        
        res.json(album);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateAlbum = async (req, res) => {
    try {
        const { name, coverImage, order } = req.body;
        const album = await Album.findByIdAndUpdate(
            req.params.id, 
            { name, coverImage, order }, 
            { new: true }
        );
        res.json(album);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAlbum = async (req, res) => {
    try {
        await Album.findByIdAndDelete(req.params.id);
        res.json({ message: "Album deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
