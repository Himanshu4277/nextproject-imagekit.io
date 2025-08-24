"use client";
import React, { useState } from "react";
import FileUpload from "./FileUpload";
import { useRouter } from "next/navigation";

export default function VideoUploadForm() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<any>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    if (!videoFile) {
      setError("Please upload a video file.");
      setLoading(false);
      return;
    }

    let finalThumbnailUrl = thumbnailFile?.url;
    if (!finalThumbnailUrl) {
      finalThumbnailUrl = `${videoFile.url}?tr=f-image`;
    }

    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          videoUrl: videoFile.url,
          thumbnailUrl: finalThumbnailUrl,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Upload failed: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      setResponse(data);
      console.log("Upload success:", data);
      router.push("/");
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto  bg-gradient-to-r from-indigo-600 via-pink-500 to-yellow-400  text-white rounded-2xl shadow-2xl p-8 space-y-6 "
    >
      <div>
        <label className="block font-semibold text-sm text-white mb-2">
          🎬 Title
        </label>
        <input
          name="title"
          placeholder="Title..."
          type="text"
          className="mt-1 w-full px-4 py-3 border border-gray-300  rounded-lg bg-white/90 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm transition"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-semibold text-sm text-white mb-2">
          📝 Description
        </label>
        <textarea
          name="description"
          placeholder="description.."
          className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg bg-white/90 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm transition"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-semibold text-sm text-white mb-2">
          📁 Upload Video
        </label>
        <div className="p-4 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 ">
          <FileUpload fileType="video"  onSuccess={(res: any) => setVideoFile(res)} />
        </div>
      </div>

      <div>
        <label className="block font-semibold text-sm text-white mb-2">
          🖼️ Optional Thumbnail Image
        </label>
        <div className="p-4 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700  dark:bg-transparent">
          <FileUpload fileType="image" onSuccess={(res: any) => setThumbnailFile(res)} />
        </div>
        {thumbnailFile && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Thumbnail selected: {thumbnailFile.name || "(No name)"}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full px-5 py-3 font-semibold rounded-lg border text-white shadow-md transform transition-all duration-150 ${
          loading
            ? "opacity-60 cursor-not-allowed bg-gradient-to-r from-indigo-300 to-purple-300"
            : "bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:scale-[1.01]"
        }`}
      >
        {loading ? "Publishing..." : "🚀 Publish Video"}
      </button>

      {error && (
        <p className="text-red-700 dark:text-red-300 font-medium mt-4 p-3 bg-red-50 dark:bg-red-900/40 border-l-4 border-red-500 rounded-md animate-fade-in">
          ❌ {error}
        </p>
      )}

      {response && !error && (
        <p className="text-emerald-700 dark:text-emerald-300 font-medium mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/30 border-l-4 border-emerald-500 rounded-md animate-fade-in">
          ✅ Video uploaded successfully! Redirecting...
        </p>
      )}
    </form>
  );
}
