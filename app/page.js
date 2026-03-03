"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SentimentBadge from "./components/SentimentBadge";

export default function Home() {
  const [imdbId, setImdbId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveHistory = (id) => {
    const updated = [...new Set([id, ...history])].slice(0, 5);
    setHistory(updated);
    localStorage.setItem("history", JSON.stringify(updated));
  };

  const fetchMovie = async (idParam) => {
    const id = idParam || imdbId;
    if (!id) return setError("Please enter IMDb ID");

    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch("/api/movie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imdbId: id }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error);
      } else {
        setData(result);
        saveHistory(id);
      }
    } catch {
      setError("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center px-4 sm:px-6 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
        AI Movie Insight Builder
      </h1>

      {/* Search Section */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 w-full max-w-md">
        <input
          type="text"
          placeholder="Enter IMDb ID (tt0133093)"
          className="p-3 rounded text-black w-full"
          value={imdbId}
          onChange={(e) => setImdbId(e.target.value)}
        />
        <button
          onClick={() => fetchMovie()}
          className="bg-blue-600 px-4 py-3 rounded hover:bg-blue-700 transition w-full sm:w-auto"
        >
          Search
        </button>
      </div>

      {/* Search History */}
      {history.length > 0 && (
        <div className="mb-6 text-sm text-center">
          <p className="mb-2">Recent Searches:</p>
          <div className="flex gap-2 flex-wrap justify-center">
            {history.map((id) => (
              <button
                key={id}
                onClick={() => fetchMovie(id)}
                className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
              >
                {id}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <p className="animate-pulse text-blue-400">
          Analyzing movie with AI...
        </p>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {data && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-4xl"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={data.movie.Poster}
              alt="Poster"
              className="w-full max-w-xs mx-auto md:mx-0 rounded-lg"
            />

            <div>
              <h2 className="text-2xl font-bold mb-2">{data.movie.Title}</h2>

              <p>
                <strong>Year:</strong> {data.movie.Year}
              </p>
              <p>
                <strong>Rating:</strong> {data.movie.imdbRating}
              </p>
              <p>
                <strong>Cast:</strong> {data.movie.Actors}
              </p>

              <p className="mt-3 text-gray-300">{data.movie.Plot}</p>

              {/* Sentiment Section */}
              <div className="mt-4">
                <SentimentBadge sentiment={data.sentiment} />

                {/* Confidence Bar */}
                {data.confidence && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-400">
                      Sentiment Strength: {data.confidence}%
                    </p>

                    <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full ${
                          data.sentiment === "Positive"
                            ? "bg-green-500"
                            : data.sentiment === "Negative"
                              ? "bg-red-500"
                              : "bg-yellow-400"
                        }`}
                        style={{ width: `${data.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Summary */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">AI Audience Insight</h3>
            <p className="text-gray-300 whitespace-pre-line">
              {data.aiSummary}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
