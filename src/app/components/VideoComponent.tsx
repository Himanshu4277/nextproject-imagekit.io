"use client";
import Link from "next/link";
import { useRef } from "react";
import { IVideo } from "@/app/models/videos.model";

export default function VideoComponent({ video }: { video: IVideo }) {
  const vidRef = useRef<HTMLVideoElement | null>(null);

  const endpoint = (process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "").replace(/\/$/, "");
  const src = video.videoUrl?.startsWith("http")
    ? video.videoUrl
    : `${endpoint}/${video.videoUrl}`;

  const poster =
    video.thumbnailUrl && video.thumbnailUrl.length
      ? (video.thumbnailUrl.startsWith("http") ? video.thumbnailUrl : `${endpoint}/${video.thumbnailUrl}`)
      : `${src}/ik-thumbnail.jpg?tr=so-1,w-640`;

  const handleMouseEnter = async () => {
    try {
      if (vidRef.current) {
        vidRef.current.currentTime = 0;
        vidRef.current.muted = true;
        await vidRef.current.play();
      }
    } catch (err) {
      console.error(err);

    }
  };

  const handleMouseLeave = () => {
    if (vidRef.current) {
      vidRef.current.pause();
      try {
        vidRef.current.currentTime = 0;
      } catch { }
    }
  };

  return (
    <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300">
      <figure style={} className="relative  px-4 pt-4">
        <div
          className="rounded-xl overflow-hidden relative w-full group"
          style={{ aspectRatio: "9/16" }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >

          <img
            src={poster}
            alt={video.title || "video thumbnail"}
            className="w-full h-full object-cover block"

          />
          <video
            ref={vidRef}
            src={src}
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-200"

            style={{ pointerEvents: "none" }}
          />
        </div>
      </figure>

      <div className="card-body p-4">
        <Link href={`/videos/${video._id}`} className="hover:opacity-80 transition-opacity">
          <h2 className="card-title text-lg">{video.title}</h2>
        </Link>
        <div className="border border-gray-800"></div>
        <p className="text-sm text-base-content/70 line-clamp-2">
          {video.description}
        </p>
      </div>
    </div>
  );
}
