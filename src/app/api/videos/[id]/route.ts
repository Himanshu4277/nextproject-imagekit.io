import { NextRequest, NextResponse } from "next/server";
import { connToDb } from "@/app/lib/db";
import Video from "@/app/models/videos.model";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connToDb();
    const video = await Video.findById(params.id).lean();

    if (!video) {
      return NextResponse.json({ message: "Video not found" }, { status: 404 });
    }

    return NextResponse.json(video, { status: 200 });
  } catch (error) {
    console.error("GET /api/videos/[id] error:", error);
    return NextResponse.json({ message: "Failed to fetch video" }, { status: 500 });
  }
}
