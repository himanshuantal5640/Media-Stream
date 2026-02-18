import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import VideoCard from "../components/VideoCard";
import ShimmerCard from "../components/ShimmerCard";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchVideos = async () => {
      setLoading(true);

      try {
        const API_KEY = import.meta.env.VITE_VIDEO_API_KEY;

        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=24&q=${query}&key=${API_KEY}`
        );

        const data = await res.json();
        setVideos(data.items || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [query]); // ⭐ THIS LINE FIXES YOUR BUG

  return (
    <div className="pt-20 px-4 text-black dark:text-white">
      <h2 className="text-2xl font-semibold mb-6">
        Results for: <span className="text-blue-500">{query}</span>
      </h2>

      {loading && (
        <div className="grid grid-cols-4 gap-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <ShimmerCard key={i} />
          ))}
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id.videoId} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
