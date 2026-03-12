
import dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });  

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../../models/User.js";

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGO_URI);  
}

async function createAdmin() {
  await connectDB();

  const email = "admin@pinecreativeagency.com";
  const plainPassword = "@pineCreative123";

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Admin already exists");
    process.exit();
  }

  const admin = new User({
    name: "Admin",
    email,
    password: hashedPassword,
    role: "admin",
  });

  await admin.save();
  console.log("Admin user created successfully");
  process.exit();
}

createAdmin();
