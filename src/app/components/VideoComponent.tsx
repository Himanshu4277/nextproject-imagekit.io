"use client";
import Link from "next/link";
import { useRef } from "react";
import { IVideo } from "@/app/models/videos.model";

export default function VideoComponent({ video }: { video: IVideo }) {
  const vidRef = useRef<HTMLVideoElement | null>(null);

  const endpoint = (process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "").replace(/\/$/, "");

  // Build video src (handle full URLs or relative paths)
  const src = video.videoUrl?.startsWith("http")
    ? video.videoUrl
    : `${endpoint}/${video.videoUrl.replace(/^\//, "")}`;

  // Helper: derive a likely image path by replacing video extension with .jpg
  const deriveImageFromVideo = (videoPath: string) =>
    videoPath.replace(/\.\w+(\?.*)?$/, ".jpg");

  const poster =
    video.thumbnailUrl && video.thumbnailUrl.length
      ? (video.thumbnailUrl.startsWith("http")
          ? video.thumbnailUrl
          : `${endpoint}/${video.thumbnailUrl.replace(/^\//, "")}`)
      : // fallback poster derived from video filename + ImageKit transform query
        `${deriveImageFromVideo(src)}?tr=so-1,w-640`;

  const handleMouseEnter = async () => {
    if (vidRef.current) {
      vidRef.current.currentTime = 0;
      vidRef.current.muted = true;
      try {
        await vidRef.current.play();
      } catch (err) {
        console.warn("Video could not play:", err);
      }
    }
  };

  const handleMouseLeave = () => {
    if (vidRef.current) {
      vidRef.current.pause();
      try {
        vidRef.current.currentTime = 0;
      } catch { /* ignore */ }
    }
  };

  return (
    <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300">
      <figure className="relative px-4 pt-4">
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
            loading="lazy"
            crossOrigin="anonymous"
            onError={(e) => {
              // if poster fails, set to a local fallback (ensure you have /fallback-thumb.jpg)
              (e.currentTarget as HTMLImageElement).src = "/fallback-thumb.jpg";
            }}
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
            crossOrigin="anonymous"
            onError={() => {
              console.warn("Video failed to load:", src);
              if (vidRef.current) {
                // hide broken video to keep poster visible
                vidRef.current.style.display = "none";
              }
            }}
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
