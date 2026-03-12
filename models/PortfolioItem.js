// models/PortfolioItem.js
import mongoose from "mongoose";

const PortfolioItemSchema = new mongoose.Schema({
  type: { type: String, enum: ["image", "video"], required: true },
  url: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String }, 
  tags: [{ type: String }],     
  link: { type: String },     
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.PortfolioItem ||
  mongoose.model("PortfolioItem", PortfolioItemSchema);
