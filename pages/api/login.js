import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();

  // 🔑 Seed default admin if not exists
  const adminEmail = "admin@pinecreative.com";
  const adminPassword = "pinecreativeagency";

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    admin = await User.create({
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });
    console.log("✅ Default admin created");
  }

  // Normal login flow
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({ token });
}
