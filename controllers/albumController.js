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
    if (req.query.categoryId) {
        const albums = await Album.find({ categoryId: req.query.categoryId }).sort({ order: 1 });
        return res.json(albums);
    }
    const albums = await Album.find().sort({ order: 1 });
    res.json(albums);
};

exports.getAlbumById = async (req, res) => {
    try {
        const album = await Album.findById(req.params.id);
        if (!album) {
            return res.status(404).json({ message: "Album not found" });
        }
        res.json(album);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateAlbum = async (req, res) => {
    try {
        const { name, categoryId, coverImage, order } = req.body;
        const album = await Album.findByIdAndUpdate(req.params.id, { name, categoryId, coverImage, order }, { new: true });
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

exports.reorderAlbum = async (req, res) => {
    try {
        const { id } = req.params;
        const { order, categoryId } = req.body;
        
        if (!order && order !== 0) {
            return res.status(400).json({ message: "Order is required" });
        }
        
        if (!categoryId) {
            return res.status(400).json({ message: "Category ID is required" });
        }
        
        // Get the album to reorder
        const albumToReorder = await Album.findById(id);
        if (!albumToReorder) {
            return res.status(404).json({ message: "Album not found" });
        }
        
        const oldOrder = albumToReorder.order;
        const newOrder = parseInt(order);
        
        // Update albums affected by the reordering in the same category
        if (oldOrder < newOrder) {
            // Moving down in the list
            await Album.updateMany(
                { 
                    categoryId,
                    order: { $gt: oldOrder, $lte: newOrder } 
                },
                { $inc: { order: -1 } }
            );
        } else if (oldOrder > newOrder) {
            // Moving up in the list
            await Album.updateMany(
                { 
                    categoryId,
                    order: { $lt: oldOrder, $gte: newOrder } 
                },
                { $inc: { order: 1 } }
            );
        }
        
        // Update the album's order
        albumToReorder.order = newOrder;
        await albumToReorder.save();
        
        res.json({ message: "Album reordered successfully", album: albumToReorder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};