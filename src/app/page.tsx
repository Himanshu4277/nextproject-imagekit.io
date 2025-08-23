
import VideoFeed from "./components/VideoFeed";
import Video from "./models/videos.model";
import { connToDb } from "./lib/db";
import type { IVideo } from "./models/videos.model";

export default async function Home() {
  await connToDb();

  let videos = [] as unknown as IVideo[];

  try {
    videos = (await Video.find().lean()) as unknown as IVideo[];
     videos = JSON.parse(JSON.stringify(videos)); 
    console.log("Fetched videos count:", videos?.length);
    if (videos.length > 0) console.log("First video:", videos[0]);
  } catch (err) {
    console.error("DB fetch error:", err);
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <main className="flex flex-col flex-1">
        <div className="h-px bg-gray-700 opacity-50" />

        {/* Video Section */}
        <section className="flex-1 py-6">
          <div className="max-w-screen-lg mx-auto px-4 ">
            <VideoFeed videos={videos} />
          </div>
        </section>

        {/* Bottom separator */}
        <div className="h-px bg-gray-700 opacity-50" />

        {/* Footer */}
        <footer className="bg-gradient-to-t from-gray-900 to-black text-gray-400 p-4 text-center">
          <p className="text-xs tracking-wide">&copy; 2025 My Website. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}