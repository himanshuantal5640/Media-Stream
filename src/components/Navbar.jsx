import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiSun, FiMoon, FiMenu } from "react-icons/fi";
import { BiVideoPlus } from "react-icons/bi";
import { FaUser } from "react-icons/fa";

export default function Navbar({ toggleSidebar }) {

  const navigate = useNavigate();

  // search
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // history
  const [searchHistory, setSearchHistory] = useState(() => {
    const stored = localStorage.getItem("searchHistory");
    return stored ? JSON.parse(stored) : [];
  });

  // suggestions
  const [suggestions, setSuggestions] = useState([]);

  // dark mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved !== null ? JSON.parse(saved) : true;
  });

  // apply dark mode
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);



  // 🔴 FETCH YOUTUBE SUGGESTIONS (debounced)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${searchQuery}`
        );
        const data = await res.json();
        setSuggestions(data[1] || []);
      } catch (err) {
        console.error(err);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);



  // 🔴 HANDLE SEARCH
  const handleSearch = (e) => {
    e.preventDefault();

    const query = searchQuery.trim();
    if (!query) return;

    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

    history = history.filter(item => item.toLowerCase() !== query.toLowerCase());
    history.unshift(query);
    history = history.slice(0, 10);

    localStorage.setItem("searchHistory", JSON.stringify(history));
    setSearchHistory(history);

    setShowDropdown(false);
    navigate(`/search?q=${query}`);
    setSearchQuery("");
  };


  // click suggestion/history
  const handleSelect = (item) => {
    setShowDropdown(false);
    setSearchQuery("");
    navigate(`/search?q=${item}`);
  };


  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 z-50">

      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
          <FiMenu className="w-6 h-6 text-black dark:text-white" />
        </button>

        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="text-xl font-semibold text-black dark:text-white">Streamix</span>
        </Link>
      </div>


      {/* SEARCH */}
      <div className="relative flex-1 max-w-2xl mx-4">

        <form onSubmit={handleSearch} className="flex items-center">
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="w-full h-10 px-4 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-l-full text-black dark:text-white focus:outline-none"
          />

          <button type="submit" className="h-10 px-6 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 border-l-0 rounded-r-full hover:bg-gray-300 dark:hover:bg-gray-700">
            <FiSearch className="w-5 h-5 text-black dark:text-white" />
          </button>
        </form>


        {/* DROPDOWN */}
        {showDropdown && (
          <div className="absolute top-12 left-0 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">

            {/* Suggestions while typing */}
            {searchQuery !== "" && suggestions.map((item, index) => (
              <div
                key={index}
                onMouseDown={() => handleSelect(item)}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-black dark:text-white"
              >
                🔎 {item}
              </div>
            ))}

            {/* History when empty */}
            {searchQuery === "" && searchHistory.map((item, index) => (
              <div
                key={index}
                onMouseDown={() => handleSelect(item)}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-black dark:text-white"
              >
                🕘 {item}
              </div>
            ))}

          </div>
        )}

      </div>


      {/* RIGHT */}
      <div className="flex items-center gap-2">
        <Link to="/upload" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
          <BiVideoPlus className="w-6 h-6 text-black dark:text-white" />
        </Link>

        <Link to="/profile" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
          <FaUser className="w-6 h-6 text-black dark:text-white" />
        </Link>

        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
          {isDarkMode ? <FiSun className="w-6 h-6 text-black dark:text-white"/> : <FiMoon className="w-6 h-6 text-black dark:text-white"/>}
        </button>
      </div>

    </nav>
  );
}
