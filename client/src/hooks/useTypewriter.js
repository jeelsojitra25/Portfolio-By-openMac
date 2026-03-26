import { useState, useEffect } from 'react';

/**
 * Cycles through an array of strings with a typewriter effect.
 * @param {string[]} words
 * @param {number} typeSpeed ms per character
 * @param {number} deleteSpeed ms per character delete
 * @param {number} pauseMs pause after full word typed
 * @returns {{ displayed: string, currentIndex: number }}
 */
export function useTypewriter(words, typeSpeed = 80, deleteSpeed = 40, pauseMs = 1800) {
  const [displayed, setDisplayed] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase] = useState('typing'); // 'typing' | 'deleting'

  useEffect(() => {
    const word = words[wordIndex % words.length];

    if (phase === 'typing') {
      if (displayed.length < word.length) {
        const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), typeSpeed);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase('deleting'), pauseMs);
        return () => clearTimeout(t);
      }
    }

    if (phase === 'deleting') {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), deleteSpeed);
        return () => clearTimeout(t);
      } else {
        setWordIndex(i => i + 1);
        setPhase('typing');
      }
    }
  }, [displayed, phase, wordIndex, words, typeSpeed, deleteSpeed, pauseMs]);

  return { displayed, currentIndex: wordIndex % words.length };
}
