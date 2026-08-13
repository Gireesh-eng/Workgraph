import { Link } from "react-router-dom";
import { useState } from "react";
import SearchBar from "./SearchBar";

export default function AppHeader({ query = "", showSearch = true, transparent = false }: { query?: string; showSearch?: boolean; transparent?: boolean }) {
  const [mobileSearch, setMobileSearch] = useState(false);

  return (
    <header className={`sticky top-0 z-30 h-20 transition-colors duration-200 ${transparent
      ? "bg-transparent border-b border-white/20"
      : "bg-[#0A0A0A] border-b border-white/20 text-white"
      }`}>
      <div className="mx-auto flex h-full max-w-[1280px] items-center gap-6 px-6 lg:px-10">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2 group">
          <span className={`font-display text-2xl font-bold tracking-tighter text-white`}>
            Work<span style={{ color: "var(--person)" }}>Graph</span>
          </span>
        </Link>

        {/* Search bar */}
        {showSearch && (
          <div className="hidden w-full max-w-[440px] sm:block ml-4">
            <SearchBar initialQuery={query} dark={true} />
          </div>
        )}

        {/* Nav */}
        <nav className="ml-auto flex items-center gap-6 font-mono text-xs uppercase tracking-widest">
          {showSearch && (
            <div className="hidden sm:flex gap-6">
              <Link to="/path" className={`text-white/70 hover:text-white transition-colors`}>PathFinder</Link>
            </div>
          )}

          {showSearch && (
            <button
              onClick={() => setMobileSearch(!mobileSearch)}
              aria-label="Open search"
              className={`flex h-9 w-9 items-center justify-center border sm:hidden border-white/20 text-white/60 hover:bg-white hover:text-black transition-colors`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="6" />
                <path d="m16 16 4 4" />
              </svg>
            </button>
          )}
        </nav>
      </div>

      {showSearch && mobileSearch && (
        <div className={`border-t px-6 py-3 sm:hidden border-white/20 bg-[#0A0A0A]`}>
          <SearchBar initialQuery={query} autoFocus dark={true} />
        </div>
      )}
    </header>
  );
}
