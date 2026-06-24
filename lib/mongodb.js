import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '@/models/user'; // import your user model

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(async (mongoose) => {
      // 🔑 Seed default admin if not exists
      const adminEmail = "admin@pinecreative.com";
      const adminPassword = "pinecreativeagency";

      const existingAdmin = await User.findOne({ email: adminEmail });
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await User.create({
          name: "Admin",
          email: adminEmail,
          password: hashedPassword,
          role: "admin",
        });
        console.log("✅ Default admin created");
      } else {
        console.log("ℹ️ Admin already exists");
      }

      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
