import React, { useState, useEffect, useRef } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { searchClient, SearchSuggestion } from "../../utils/searchClient";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  suggestionsType?: "mentors" | "skills" | "expertise";
  showFilters?: boolean;
  className?: string;
  debounceMs?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search mentors, skills, or expertise...",
  onSearch,
  onSuggestionSelect,
  suggestionsType = "mentors",
  showFilters = false,
  className = "",
  debounceMs = 300,
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search function
  const debouncedSearch = searchClient.createDebouncedSuggestions(debounceMs);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    debouncedSearch(query, suggestionsType, (results: SearchSuggestion[]) => {
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setIsLoading(false);
    });
  }, [query, suggestionsType, debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);

    if (value.trim().length === 0) {
      onSearch("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSuggestionSelect(suggestions[selectedIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    }
  };

  const handleSearch = () => {
    onSearch(query.trim());
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    } else {
      setQuery(suggestion.fullName || suggestion._id);
      onSearch(suggestion.fullName || suggestion._id);
    }
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onSearch("");
    inputRef.current?.focus();
  };

  const renderSuggestion = (suggestion: SearchSuggestion, index: number) => {
    const isSelected = index === selectedIndex;

    return (
      <div
        key={suggestion._id}
        className={`px-4 py-3 cursor-pointer transition-colors ${
          isSelected
            ? "bg-blue-50 text-blue-900"
            : "hover:bg-gray-50 text-gray-900"
        }`}
        onClick={() => handleSuggestionSelect(suggestion)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {suggestion.fullName && (
              <div className="font-medium text-sm">{suggestion.fullName}</div>
            )}
            {suggestion.professionalTitle && (
              <div className="text-xs text-gray-500 mt-1">
                {suggestion.professionalTitle}
              </div>
            )}
            {suggestion.areasOfExpertise &&
              suggestion.areasOfExpertise.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {suggestion.areasOfExpertise.slice(0, 2).map((area, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              )}
            {suggestion.count && (
              <div className="text-xs text-gray-400 mt-1">
                {suggestion.count} mentors
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length >= 2 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />

        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}

        {showFilters && (
          <button className="absolute inset-y-0 right-8 pr-3 flex items-center">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </button>
        )}
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-500">Searching...</div>
          ) : suggestions.length > 0 ? (
            <>
              {suggestions.map((suggestion, index) =>
                renderSuggestion(suggestion, index)
              )}
              <div className="px-4 py-2 border-t border-gray-100">
                <button
                  onClick={handleSearch}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Search for "{query}"
                </button>
              </div>
            </>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">
              No suggestions found
            </div>
          )}
        </div>
      )}
    </div>
  );
};
