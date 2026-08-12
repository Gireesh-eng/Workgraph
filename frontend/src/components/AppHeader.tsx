import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";

export default function AppHeader({ query = "", showSearch = true, transparent = false }: { query?: string; showSearch?: boolean; transparent?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 3);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-30 h-16 transition-all duration-200 backdrop-blur-[10px] ${transparent
      ? "bg-transparent border-b border-white/[.12]"
      : "bg-paper/95 border-b border-[#D7CEC4] shadow-[0_1px_3px_rgba(55,43,33,.05)]"
      }`}>
      <div className="mx-auto flex h-full max-w-[1280px] items-center gap-6 px-6 lg:px-10">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2 group">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-person shadow-sm">
            <svg className="h-4 w-4 text-white" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="3" r="2" fill="currentColor" />
              <circle cx="3" cy="12" r="2" fill="currentColor" fillOpacity=".75" />
              <circle cx="13" cy="12" r="2" fill="currentColor" fillOpacity=".75" />
              <line x1="8" y1="5" x2="3" y2="10" stroke="currentColor" strokeWidth="1.2" strokeOpacity=".6" />
              <line x1="8" y1="5" x2="13" y2="10" stroke="currentColor" strokeWidth="1.2" strokeOpacity=".6" />
            </svg>
          </span>
          <span className={`text-[17px] font-bold tracking-[-.02em] ${transparent ? "text-white" : "text-ink-900"}`}>
            Work<span className="text-person">Graph</span>
          </span>
        </Link>

        {/* Search bar */}
        {showSearch && (
          <div className="hidden w-full max-w-[440px] sm:block">
            <SearchBar initialQuery={query} dark={transparent} />
          </div>
        )}

        {/* Nav */}
        <nav className="ml-auto flex items-center gap-1">
          {showSearch && (
            <button
              onClick={() => setMobileSearch(!mobileSearch)}
              aria-label="Open search"
              className={`flex h-9 w-9 items-center justify-center rounded-lg sm:hidden ${transparent
                ? "text-white/60 hover:bg-white/[.08] hover:text-white"
                : "text-ink-600 hover:bg-surface-sunken hover:text-ink-900"
                }`}
            >
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="6" />
                <path d="m16 16 4 4" />
              </svg>
            </button>
          )}
        </nav>
      </div>

      {showSearch && mobileSearch && (
        <div className={`border-t px-6 py-3 sm:hidden ${transparent ? "border-white/10 bg-ink-900" : "border-border bg-paper"}`}>
          <SearchBar initialQuery={query} autoFocus dark={transparent} />
        </div>
      )}
    </header>
  );
}
