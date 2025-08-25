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
    <div className=" mx-auto p-8 bg-gray-600 w-full">
      <video
        src={`${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/${video.videoUrl}`}
        controls
        poster={video.thumbnailUrl}
        className="w-[1200px] mx-auto max-h-[500px] rounded-lg border border-gray-600 shadow-2xl"
      />
      <h1 className="text-2xl font-bold mt-4 pl-14">{video.title}</h1>
      <p className="text-base-content/70 mt-2 pl-14">{video.description}</p>
    </div>
  );
}
