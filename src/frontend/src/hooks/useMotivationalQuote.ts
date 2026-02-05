import { useState, useCallback } from 'react';
import { quotes } from '../data/quotes';

export function useMotivationalQuote() {
  const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * quotes.length));

  const refresh = useCallback(() => {
    setCurrentIndex(Math.floor(Math.random() * quotes.length));
  }, []);

  const currentQuote = quotes[currentIndex];

  return {
    quote: currentQuote.text,
    author: currentQuote.author || undefined,
    refresh,
  };
}
