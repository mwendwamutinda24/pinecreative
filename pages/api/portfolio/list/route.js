// app/api/portfolio/list/route.js
import { connectDB } from "@/lib/mongodb";
import PortfolioItem from "@/models/PortfolioItem";

export async function GET() {
  await connectDB();
  const items = await PortfolioItem.find({});
  return new Response(JSON.stringify(items), { status: 200 });
}
