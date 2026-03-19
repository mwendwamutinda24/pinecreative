// app/api/portfolio/upload/route.ts
import { v2 as cloudinary } from "cloudinary";
import PortfolioItem from "@/models/PortfolioItem"; // import your schema
import mongoose from "mongoose";
export const dynamic = "force-dynamic";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const files = formData.getAll("files") as File[]; // accept multiple files

  if (!files || files.length === 0) {
    return new Response(JSON.stringify({ error: "No files uploaded" }), { status: 400 });
  }

  // Upload each file to Cloudinary
  const uploadResults = await Promise.all(
    files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (error: any, result: any) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });
    })
  );

  // Separate images and videos
  const images: string[] = [];
  const videos: string[] = [];

  (uploadResults as any[]).forEach((result) => {
    if (result.resource_type === "image") {
      images.push(result.secure_url);
    } else if (result.resource_type === "video") {
      videos.push(result.secure_url);
    }
  });

  // Save to MongoDB
  const portfolioItem = new PortfolioItem({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    tags: formData.getAll("tags"),
    images,
    videos,
    link: formData.get("link"),
  });

  await portfolioItem.save();

  return new Response(JSON.stringify(portfolioItem), { status: 200 });
}
