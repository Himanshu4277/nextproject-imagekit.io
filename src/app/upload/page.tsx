"use client";


import VideoUploadForm from "@/app/components/VideoUploadForm";


export default function VideoUploadPage() {
return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-pink-500 to-yellow-400 w-full py-12">
<div className="w-full max-w-2xl mx-auto px-6">
<h1 className="text-4xl font-extrabold mb-8 bg-clip-text text-white text-center">
Upload New Reel
</h1>
<VideoUploadForm />
</div>
</div>
);
}