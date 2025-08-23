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
      className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-90 text-white  rounded-2xl shadow-lg p-8 space-y-8 border border-gray-200 dark:border-gray-700"
    >
      <div>
        <label className="block font-semibold text-lg dark:text-gray-100 mb-2">
          🎬 Title
        </label>
        <input
          name="title"
          type="text"
          className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-semibold text-lg text-white mb-2">
          📝 Description
        </label>
        <textarea
          name="description"
          className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-semibold text-lg text-white mb-2">
          📁 Upload Video
        </label>
        <FileUpload fileType="video" onSuccess={(res: any) => setVideoFile(res)} />
      </div>

      <div>
        <label className="block font-semibold text-lg text-white mb-2">
          🖼️ Optional Thumbnail Image
        </label>
        <FileUpload fileType="image" onSuccess={(res: any) => setThumbnailFile(res)} />
        {thumbnailFile && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Thumbnail selected: {thumbnailFile.name || "(No name)"}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full px-4 py-2 font-semibold cursor-pointer rounded-md border text-white ${
          loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {loading ? "Publishing..." : "🚀 Publish Video"}
      </button>

      {error && (
        <p className="text-red-600 dark:text-red-400 font-medium mt-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 rounded-md animate-fade-in">
          ❌ {error}
        </p>
      )}

      {response && !error && (
        <p className="text-indigo-600 dark:text-indigo-400 font-medium mt-4 p-3 bg-indigo-100 dark:bg-indigo-900 border border-indigo-400 dark:border-green-600 rounded-md animate-fade-in">
          ✅ Video uploaded successfully! Redirecting...
        </p>
      )}
    </form>
  );
}
