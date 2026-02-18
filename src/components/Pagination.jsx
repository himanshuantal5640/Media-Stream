import React from "react";

export default function Pagination({
  nextPageToken,
  prevPageToken,
  pageToken,
  setPageToken,
  pageHistory,
  setPageHistory,
  loading,
}) {

  const currentPage = pageHistory.length;

  const handleNext = () => {
    if (!nextPageToken || loading) return;

    setPageToken(nextPageToken);
    setPageHistory(prev => [...prev, nextPageToken]);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    if (pageHistory.length <= 1 || loading) return;

    const newHistory = [...pageHistory];
    newHistory.pop();

    setPageHistory(newHistory);
    setPageToken(newHistory[newHistory.length - 1]);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex justify-center items-center gap-8 mt-12 mb-10">

      {/* Previous */}
      <button
        onClick={handlePrev}
        disabled={pageHistory.length <= 1 || loading}
        className="px-5 py-2 rounded-lg font-medium bg-gray-200 dark:bg-gray-800 
                   hover:bg-gray-300 dark:hover:bg-gray-700 
                   disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        ◀ Previous
      </button>

      {/* Page Number */}
      <div className="px-4 py-2 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-black font-semibold text-lg">
        {currentPage}
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
