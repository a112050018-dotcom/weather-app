import React, { useState, useEffect } from 'react';
import { searchLocation } from '../services/weatherService';
import { GeoLocation } from '../types';

interface SearchBarProps {
  onLocationSelect: (loc: GeoLocation) => void;
  disabled: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onLocationSelect, disabled }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch suggestions
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchLocations = async () => {
      setIsSearching(true);
      try {
        const results = await searchLocation(debouncedQuery);
        setSuggestions(results);
      } catch (e) {
        console.error(e);
      } finally {
        setIsSearching(false);
      }
    };

    fetchLocations();
  }, [debouncedQuery]);

  return (
    <div className="relative w-full max-w-md mx-auto z-50">
      <div className="flex items-center glass-panel rounded-full px-4 py-3 shadow-lg transition-all focus-within:ring-2 focus-within:ring-blue-400">
        <span className="material-icons-round text-gray-400 mr-2">search</span>
        <input
          type="text"
          className="bg-transparent border-none outline-none text-white placeholder-gray-400 w-full"
          placeholder="Search city (e.g., Tokyo, London)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={disabled}
        />
        {isSearching && (
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full ml-2"></div>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-xl overflow-hidden shadow-2xl max-h-60 overflow-y-auto">
          {suggestions.map((loc, idx) => (
            <button
              key={`${loc.name}-${idx}`}
              className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors flex items-center justify-between border-b border-white/5 last:border-0"
              onClick={() => {
                onLocationSelect(loc);
                setQuery('');
                setSuggestions([]);
              }}
            >
              <div>
                <span className="font-semibold block text-white">{loc.name}</span>
                <span className="text-xs text-gray-400">{loc.country}</span>
              </div>
              <span className="material-icons-round text-gray-500 text-sm">north_east</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};