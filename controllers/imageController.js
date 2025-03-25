const Image = require("../models/Image");
const { uploadToCloudinary } = require("../services/imageServices");

exports.createImage = async (req, res) => {
    try {
        const { albumId, alt, order } = req.body;
        
        let url;
        
        // Check if a file was uploaded
        if (req.file) {
            // Upload the image to Cloudinary
            const result = await uploadToCloudinary(req.file.buffer);
            url = result.secure_url;
        }  else {
            return res.status(400).json({ error: "No image file or URL provided" });
        }
        
        // Create a new image document with correct field names
        const newImage = new Image({ 
            albumId, 
            url, // Using 'url' instead of 'imageUrl' to match the model
            alt: alt || "",
            order: order || 0 
        });
        
        await newImage.save();
        res.status(201).json(newImage);
    } catch (error) {
        console.error("Error creating image:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getImages = async (req, res) => {
    try {
      const { albumId } = req.params;
      
      let query = {};
      if (albumId) {
        query.albumId = albumId;
      }
      
      const images = await Image.find(query).sort({ order: 1 });
      res.status(200).json(images);
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).json({ message: "Failed to fetch images" });
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
        const { url, alt, order } = req.body;
        const updates = { order };
        
        // Only update fields that are provided
        if (url) updates.url = url;
        if (alt !== undefined) updates.alt = alt;
        
        const image = await Image.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }
        
        res.json(image);
    } catch (error) {
        console.error("Error updating image:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteImage = async (req, res) => {
    try {
        const image = await Image.findByIdAndDelete(req.params.id);
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }
        
        // Reorder remaining images
        await Image.updateMany(
            { albumId: image.albumId, order: { $gt: image.order } },
            { $inc: { order: -1 } }
        );
        
        res.json({ message: "Image deleted successfully" });
    } catch (error) {
        console.error("Error deleting image:", error);
        res.status(500).json({ error: error.message });
    }
};

// New bulk upload method
exports.bulkUploadImages = async (req, res) => {
    try {
        const { albumId } = req.body;
        
        if (!albumId) {
            return res.status(400).json({ error: "Album ID is required" });
        }
        
        // Check if files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No image files provided" });
        }
        
        // Get current max order for the album
        const maxOrderImage = await Image.findOne({ albumId }).sort({ order: -1 });
        let currentOrder = maxOrderImage ? maxOrderImage.order : 0;
        
        // Array to store the uploaded images
        const uploadedImages = [];
        
        // Process each uploaded file
        for (const file of req.files) {
            try {
                // Upload the image to Cloudinary
                const result = await uploadToCloudinary(file.buffer);
                
                // Create a new image document
                const newImage = new Image({
                    albumId,
                    url: result.secure_url,
                    alt: req.body.alt || "",
                    order: ++currentOrder
                });
                
                // Save the image
                await newImage.save();
                uploadedImages.push(newImage);
            } catch (uploadError) {
                console.error("Error uploading individual image:", uploadError);
                // Continue with other images even if one fails
            }
        }
        
        if (uploadedImages.length === 0) {
            return res.status(500).json({ error: "All image uploads failed" });
        }
        
        res.status(201).json({
            message: `Successfully uploaded ${uploadedImages.length} of ${req.files.length} images`,
            images: uploadedImages
        });
    } catch (error) {
        console.error("Error in bulk upload:", error);
        res.status(500).json({ error: error.message });
    }
};
