import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function WatchHistory() {
  const [history, setHistory] = useState([]);

  // Load history
  function loadHistory() {
    const stored = JSON.parse(localStorage.getItem("watchHistory")) || [];
    setHistory(stored);
  }

  useEffect(() => {
    loadHistory();

    // reload when tab refocus (like youtube)
    window.addEventListener("focus", loadHistory);
    return () => window.removeEventListener("focus", loadHistory);
  }, []);

  // Clear history
  function clearHistory() {
    localStorage.removeItem("watchHistory");
    setHistory([]);
  }

  // Empty state
  if (history.length === 0) {
    return (
      <div className="text-center py-24 text-gray-600 dark:text-gray-400">
        <h2 className="text-2xl font-semibold mb-2">No watch history</h2>
        <p>Videos you watch will appear here</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto text-black dark:text-white px-4">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Watch History</h1>

        <button
          onClick={clearHistory}
          className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
        >
          Clear All
        </button>
      </div>

      {/* Videos */}
      <div className="space-y-4">
        {history.map(video => (
          <Link
            key={video.id}
            to={`/watch/${video.id}`}
            className="flex gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {/* Thumbnail */}
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-48 h-28 object-cover rounded-lg"
            />

            {/* Info */}
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="font-semibold line-clamp-2">
                  {video.title}
                </h2>

                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {video.channel}
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {parseInt(video.views).toLocaleString()} views
                </p>
              </div>

              <p className="text-xs text-gray-400">
                Watched {new Date(video.watchedAt).toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
