const mongoose = require("mongoose");

const AlbumSchema = new mongoose.Schema({
    name: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    coverImage: { type: String },
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Album", AlbumSchema);
