import { useState, useEffect } from "react";

export default function useRecommendedVideos(videoId, title) {

  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!videoId || !title) return;

    let ignore = false;

    async function fetchRecommended() {
      try {
        setLoading(true);
        setError(null);

        const API_KEY = import.meta.env.VITE_VIDEO_API_KEY;

        // extract keywords from title
        const query = title.split(" ").slice(0, 5).join(" ");

        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&q=${encodeURIComponent(query)}&key=${API_KEY}`
        );

        const data = await res.json();

        if (ignore) return;

        const filtered = (data.items || []).filter(
          v => v.id.videoId !== videoId
        );

        setRecommended(filtered);

      } catch (err) {
        if (!ignore) setError("Failed to load recommendations");
        console.error("Recommendation error:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchRecommended();

    return () => {
      ignore = true; // prevents race condition when switching videos fast
    };

  }, [videoId, title]);

  return { recommended, loading, error };
}
