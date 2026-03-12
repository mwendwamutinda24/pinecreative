
import { connectDB } from "@/lib/mongodb";
import PortfolioItem from "@/models/PortfolioItem";

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const item = new PortfolioItem(body);
  await item.save();
  return new Response(JSON.stringify({ message: "Item added successfully" }), {
    status: 201,
  });
}
