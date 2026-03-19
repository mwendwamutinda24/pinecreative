import mongoose from "mongoose";

const PortfolioItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String }, // e.g. Corporate, Event Coverage, etc.
  tags: [{ type: String }],

  // Arrays for multiple media
  images: [{ type: String }], // Cloudinary URLs for images
  videos: [{ type: String }], // Cloudinary URLs for videos

  link: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.PortfolioItem ||
  mongoose.model("PortfolioItem", PortfolioItemSchema);
