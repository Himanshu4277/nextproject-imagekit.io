import { notFound } from "next/navigation";

export default async function VideoPage({ params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/${params.id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    notFound();
  }

  const video = await res.json();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <video
        src={`${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/${video.videoUrl}`} 
        controls
        poster={video.thumbnailUrl}
        className="w-full rounded-lg"
      />
      <h1 className="text-2xl font-bold mt-4">{video.title}</h1>
      <p className="text-base-content/70 mt-2">{video.description}</p>
    </div>
  );
}
