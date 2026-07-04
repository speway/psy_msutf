import { NextResponse } from "next/server";
import { getSitePosts } from "@/lib/post-source";

export async function GET() {
  const posts = getSitePosts();

  return NextResponse.json({
    status: "ok",
    app: "psy_msutf",
    mode: "vercel-next",
    posts: posts.length,
    timestamp: new Date().toISOString(),
  });
}
