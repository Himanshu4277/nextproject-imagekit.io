import { NextRequest, NextResponse } from "next/server";
import { connToDb } from "@/app/lib/db";
import Video from "@/app/models/videos.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";

type CreateVideoDto = {
    title: string;
    description?: string;
    videoUrl: string;
    thumbnailUrl?: string;
    controls?: boolean;
    transformation?: {
        height?: number;
        width?: number;
        quality?: number;
    };
};

// ✅ utility: full ImageKit URL ko relative path me convert karega
const cleanPath = (url: string) => {
    const endpoint =
        process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT?.replace(/\/$/, "") || "";
    if (!endpoint) return url;

    if (url.startsWith(endpoint)) {
        return url.replace(endpoint, "").replace(/^\/+/, "");
    }
    return url;
};

export async function GET() {
    try {
        await connToDb();
        const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
        return NextResponse.json(videos ?? [], { status: 200 });
    } catch (error) {
        console.error("GET /api/videos error:", error);
        return NextResponse.json(
            { message: "Failed to fetch videos" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = (await request.json()) as CreateVideoDto;
        if (!body || !body.title || !body.videoUrl) {
            return NextResponse.json(
                { message: "Missing required fields: title, videoUrl, or thumbnailUrl" },
                { status: 400 }
            );
        }

        await connToDb();

        const videoData = {
            title: body.title,
            description: body.description ?? "",
            // ✅ relative path save karo
            videoUrl: cleanPath(body.videoUrl),
            thumbnailUrl: body.thumbnailUrl
                ? body.thumbnailUrl
                : `${cleanPath(body.videoUrl)}?tr=f-jpg,so-1`,
            controls: typeof body.controls === "boolean" ? body.controls : true,
            transformation: {
                height: body.transformation?.height ?? 1920,
                width: body.transformation?.width ?? 1080,
                quality: body.transformation?.quality ?? 100,
            },
        };

        const created = await Video.create(videoData);
        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        console.error("POST /api/videos error:", error);
        return NextResponse.json(
            { message: "Failed to create video" },
            { status: 500 }
        );
    }
}
