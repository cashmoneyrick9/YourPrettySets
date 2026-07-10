import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Search, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { helpSearchEntries, type HelpSearchEntry } from "@/data/helpContent";

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function searchableText(entry: HelpSearchEntry) {
  return normalizeSearchText([entry.title, entry.context, ...entry.keywords].join(" "));
}

function findHelpResults(query: string) {
  const normalizedQuery = normalizeSearchText(query);
  if (normalizedQuery.length < 2) return [];

  const terms = normalizedQuery.split(" ").filter(Boolean);

  return helpSearchEntries
    .map((entry) => {
      const title = normalizeSearchText(entry.title);
      const searchText = searchableText(entry);
      if (!terms.every((term) => searchText.includes(term))) return null;

      let score = terms.reduce((total, term) => total + (title.includes(term) ? 4 : 1), 0);
      if (title === normalizedQuery) score += 20;
      if (title.startsWith(normalizedQuery)) score += 8;

      return { entry, score };
    })
    .filter((result): result is { entry: HelpSearchEntry; score: number } => Boolean(result))
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .slice(0, 7)
    .map(({ entry }) => entry);
}

export function HelpSearch() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const navigate = useNavigate();
  const normalizedQuery = query.trim();
  const results = useMemo(() => findHelpResults(query), [query]);
  const hasSearch = normalizedQuery.length >= 2;

  function clearSearch() {
    setQuery("");
    inputRef.current?.focus();
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape" && query) {
      event.preventDefault();
      clearSearch();
      return;
    }

    if (event.key === "ArrowDown" && results.length > 0) {
      event.preventDefault();
      resultRefs.current[0]?.focus();
    }
  }

  return (
    <form
      className="help-search"
      onSubmit={(event) => {
        event.preventDefault();
        if (results[0]) navigate(results[0].href);
      }}
      role="search"
    >
      <label className="help-search__label" htmlFor="help-guide-search">
        Search the guide
      </label>
      <div className="help-search__field">
        <Search aria-hidden="true" className="help-search__icon" size={20} strokeWidth={1.7} />
        <input
          aria-controls={hasSearch ? "help-search-results" : undefined}
          aria-describedby="help-search-hint"
          autoComplete="off"
          className="help-search__input"
          id="help-guide-search"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Try “sizing,” “glue,” or “lost package”"
          ref={inputRef}
          type="search"
          value={query}
        />
        {query ? (
          <button aria-label="Clear Help search" className="help-search__clear" onClick={clearSearch} type="button">
            <X aria-hidden="true" size={18} strokeWidth={1.8} />
          </button>
        ) : null}
      </div>
      <p className="help-search__hint" id="help-search-hint">
        Search guides, steps, and common questions.
      </p>

      {hasSearch ? (
        <div aria-live="polite" className="help-search__results" id="help-search-results">
          {results.length > 0 ? (
            <>
              <p className="help-search__status">
                {results.length} {results.length === 1 ? "result" : "results"} for “{normalizedQuery}”
              </p>
              <ul className="help-search__list">
                {results.map((result, index) => (
                  <li key={result.id}>
                    <Link
                      className="help-search__result"
                      ref={(node) => {
                        resultRefs.current[index] = node;
                      }}
                      to={result.href}
                    >
                      <span>
                        <strong>{result.title}</strong>
                        <small>{result.context}</small>
                      </span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="help-search__empty">
              <p>No guide results for “{normalizedQuery}”.</p>
              <div>
                <Link to="/help/faq">Browse the FAQ</Link>
                <Link to="/help/contact">Contact Support</Link>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </form>
  );
}
