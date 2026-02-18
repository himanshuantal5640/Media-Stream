import React, { useState, useEffect } from "react";

export default function Pagination({
  nextPageToken,
  prevPageToken,
  setPageToken,
  loading,
}) {
  const [page, setPage] = useState(1);

  // Reset when new category loads (no prev token = first page)
  useEffect(() => {
    if (!prevPageToken) setPage(1);
  }, [prevPageToken]);

  const handleNext = () => {
    if (!nextPageToken || loading) return;
    setPageToken(nextPageToken);
    setPage((p) => p + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    if (!prevPageToken || loading) return;
    setPageToken(prevPageToken);
    setPage((p) => Math.max(1, p - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex justify-center items-center gap-8 mt-12 mb-10">

      {/* Previous */}
      <button
        onClick={handlePrev}
        disabled={!prevPageToken || loading}
        className="px-5 py-2 rounded-lg font-medium bg-gray-200 dark:bg-gray-800 
                   hover:bg-gray-300 dark:hover:bg-gray-700 
                   disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        ◀ Previous
      </button>

      {/* Page Number */}
      <div className="px-4 py-2 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-black font-semibold text-lg">
        {page}
      </div>

      {/* Next */}
      <button
        onClick={handleNext}
        disabled={!nextPageToken || loading}
        className="px-5 py-2 rounded-lg font-medium bg-gray-200 dark:bg-gray-800 
                   hover:bg-gray-300 dark:hover:bg-gray-700 
                   disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        Next ▶
      </button>
    </div>
  );
}
