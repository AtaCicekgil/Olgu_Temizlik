import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Loader2, X } from 'lucide-react';
import { SearchState } from '../../types/tracking';

interface Props {
  onSearch: (code: string) => void;
  searchState: SearchState;
  initialValue?: string;
}

const EXAMPLE_CODES = ['OHY-2025-00142', 'OHY-2025-00178', 'OHY-2025-00089'];

const TrackingSearchInput: React.FC<Props> = ({ onSearch, searchState, initialValue = '' }) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const isLoading = searchState === 'loading';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length < 3 || isLoading) return;
    onSearch(trimmed);
  };

  const handleClear = () => {
    setValue('');
    inputRef.current?.focus();
  };

  const handleExampleClick = (code: string) => {
    setValue(code);
    inputRef.current?.focus();
  };

  // Auto-uppercase as user types
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value.toUpperCase());
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Input card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative"
      >
        <form onSubmit={handleSubmit}>
          <div
            className="flex items-center rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Search icon */}
            <div className="pl-5 pr-3 text-blue-300 flex-shrink-0">
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </div>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={handleChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e as any)}
              placeholder="OHY-2025-XXXXX"
              disabled={isLoading}
              autoFocus
              className="flex-1 bg-transparent py-4 pr-2 text-white placeholder-blue-300/50 text-base font-mono tracking-wider outline-none disabled:opacity-60"
              style={{ letterSpacing: '0.08em' }}
            />

            {/* Clear button */}
            <AnimatePresence>
              {value.length > 0 && !isLoading && (
                <motion.button
                  type="button"
                  onClick={handleClear}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="p-2 mr-1 text-blue-300/60 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={value.trim().length < 3 || isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="m-2 flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #4f6ef7 0%, #7c3aed 100%)',
                boxShadow: value.trim().length >= 3 ? '0 4px 16px rgba(79,110,247,0.5)' : 'none',
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Sorgulanıyor</span>
                </>
              ) : (
                <>
                  <span>Sorgula</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Example codes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="mt-4 flex flex-wrap items-center justify-center gap-2"
      >
        <span className="text-blue-300/50 text-xs">Örnek kodlar:</span>
        {EXAMPLE_CODES.map((code) => (
          <button
            key={code}
            onClick={() => handleExampleClick(code)}
            className="text-xs font-mono text-blue-300/70 hover:text-blue-200 transition-colors px-2 py-1 rounded-md hover:bg-white/5"
          >
            {code}
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default TrackingSearchInput;
