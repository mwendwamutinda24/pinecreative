// app/api/portfolio/upload/route.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ resource_type: "auto" }, (error: any, result: unknown) => {
      if (error) reject(error);
      else resolve(result);
    }).end(buffer);
  });

  return new Response(JSON.stringify(uploadResult), { status: 200 });
}
