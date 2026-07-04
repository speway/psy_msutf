import { NextResponse } from "next/server";
import { getSitePosts } from "@/lib/post-source";

export async function GET() {
  return NextResponse.json(getSitePosts());
}
