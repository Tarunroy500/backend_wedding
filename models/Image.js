const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    albumId: { type: mongoose.Schema.Types.ObjectId, ref: "Album", required: true },
    url: { type: String, required: true },
    alt: { type: String, default: "" },
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Image", ImageSchema);
