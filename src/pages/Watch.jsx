import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Watch() {
  const params = useParams();
  const id = params?.id || null;

  const [videoDetails, setVideoDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  // ---------------- SAVE HISTORY ----------------
  function saveToHistory(video) {
    if (!video) return;

    const history = JSON.parse(localStorage.getItem("watchHistory")) || [];

    const newVideo = {
      id: video.id,
      title: video.snippet.title,
      channel: video.snippet.channelTitle,
      thumbnail: video.snippet.thumbnails.medium.url,
      views: video.statistics?.viewCount || "0",
      watchedAt: Date.now(),
    };

    // remove duplicate
    const filtered = history.filter(v => v.id !== newVideo.id);

    // newest first
    filtered.unshift(newVideo);

    // limit 50 items
    localStorage.setItem("watchHistory", JSON.stringify(filtered.slice(0, 50)));
  }

  // ---------------- FETCH VIDEO ----------------
  useEffect(() => {
    if (!id) return;

    async function fetchVideoDetails() {
      try {
        setLoading(true);

        const API_KEY = import.meta.env.VITE_VIDEO_API_KEY;

        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${API_KEY}`
        );

        const data = await response.json();

        if (data.items && data.items.length > 0) {
          const video = data.items[0];
          setVideoDetails(video);
          saveToHistory(video);
        } else {
          setVideoDetails(null);
        }
      } catch (error) {
        console.error("Error fetching video:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVideoDetails();
  }, [id]);

  // ---------------- NO VIDEO SELECTED ----------------
  if (!id) {
    return (
      <div className="text-black dark:text-white text-center py-20">
        <h2 className="text-2xl font-semibold mb-2">Watch Page</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select a video to watch
        </p>
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <div className="text-black dark:text-white max-w-7xl mx-auto px-4">

      {/* Player */}
      <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${id}`}
          title="YouTube player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
      )}

      {/* Details */}
      {!loading && videoDetails && (
        <div>
          <h1 className="text-xl md:text-2xl font-semibold mb-2">
            {videoDetails.snippet.title}
          </h1>

          <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <span>
              {parseInt(videoDetails.statistics.viewCount).toLocaleString()} views
            </span>
            {videoDetails.statistics.likeCount && (
              <span>
                {parseInt(videoDetails.statistics.likeCount).toLocaleString()} likes
              </span>
            )}
          </div>

          <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
            <div className="font-semibold mb-2">
              {videoDetails.snippet.channelTitle}
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {videoDetails.snippet.description}
            </p>
          </div>
        </div>
      )}

      {/* Not found */}
      {!loading && !videoDetails && (
        <div className="text-center py-20 text-gray-500">
          Video not found
        </div>
      )}
    </div>
  );
}
