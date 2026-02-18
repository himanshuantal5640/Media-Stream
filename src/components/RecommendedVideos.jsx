import React from "react";
import { Link } from "react-router-dom";
import useRecommendedVideos from "../hooks/useRecommendedVideos";

export default function RecommendedVideos({ videoId, title }) {
  const { recommended, loading } = useRecommendedVideos(videoId, title);

  if (loading) {
    return <p className="text-gray-400">Loading recommendations...</p>;
  }

  return (
    <div className="space-y-4">
      {recommended.map((video) => (
        <Link
          key={video.id.videoId}
          to={`/watch/${video.id.videoId}`}
          className="flex gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition"
        >
          <img
            src={video.snippet.thumbnails.medium.url}
            className="w-40 h-24 object-cover rounded-lg"
          />

          <div className="flex flex-col">
            <h3 className="text-sm font-semibold line-clamp-2">
              {video.snippet.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {video.snippet.channelTitle}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
