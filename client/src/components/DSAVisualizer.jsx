/**
 * DSAVisualizer — Bubble Sort, Selection Sort, Binary Search
 *
 * Architecture: pure algorithm functions build arrays of "frames" (snapshots),
 * React plays through the frames array. Logic is independently testable.
 *
 * Frame shape:
 *   {
 *     bars: number[],        // array values at this step
 *     colors: string[],      // hex color per bar index
 *     description: string,   // human-readable explanation
 *     comparisons: number,   // cumulative comparison count
 *   }
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useIntersection } from '../hooks/useIntersection';

// ---------------------------------------------------------------------------
// Color tokens
// ---------------------------------------------------------------------------
const C_DEFAULT = '#14b8a6'; // teal — untouched
const C_COMPARE = '#fbbf24'; // yellow — currently comparing
const C_SWAP    = '#ef4444'; // red — swapping / midpoint
const C_SORTED  = '#22c55e'; // green — confirmed sorted / found
const C_DIMMED  = '#374151'; // grey — outside binary-search range

// ---------------------------------------------------------------------------
// Pure algorithm frame-builders (no React — fully unit-testable)
// ---------------------------------------------------------------------------

/**
 * Build Bubble Sort frames.
 * @param {number[]} initial
 * @returns {Array<{bars: number[], colors: string[], description: string, comparisons: number}>}
 */
export function buildBubbleSortFrames(initial) {
  const arr = [...initial];
  const n = arr.length;
  const frames = [];
  let comparisons = 0;

  const defaults = (sortedFrom = n) =>
    arr.map((_, i) => (i >= sortedFrom ? C_SORTED : C_DEFAULT));

  frames.push({
    bars: [...arr],
    colors: defaults(),
    description: 'Bubble Sort: starting with an unsorted array.',
    comparisons,
  });

  for (let i = 0; i < n - 1; i++) {
    const sortedFrom = n - i;

    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      const cmp = defaults(sortedFrom);
      cmp[j] = C_COMPARE;
      cmp[j + 1] = C_COMPARE;

      frames.push({
        bars: [...arr],
        colors: cmp,
        description: `Comparing index ${j} (${arr[j]}) and index ${j + 1} (${arr[j + 1]}).`,
        comparisons,
      });

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        const swapped = defaults(sortedFrom);
        swapped[j] = C_SWAP;
        swapped[j + 1] = C_SWAP;
        frames.push({
          bars: [...arr],
          colors: swapped,
          description: `Swapping: larger value (${arr[j + 1]}) bubbles right.`,
          comparisons,
        });
      }
    }

    frames.push({
      bars: [...arr],
      colors: defaults(n - i - 1),
      description: `Pass ${i + 1} done. Last ${i + 1} element(s) are in their final position.`,
      comparisons,
    });
  }

  frames.push({
    bars: [...arr],
    colors: Array(n).fill(C_SORTED),
    description: 'Bubble Sort complete — array fully sorted!',
    comparisons,
  });

  return frames;
}

/**
 * Build Selection Sort frames.
 * @param {number[]} initial
 * @returns {Array<{bars: number[], colors: string[], description: string, comparisons: number}>}
 */
export function buildSelectionSortFrames(initial) {
  const arr = [...initial];
  const n = arr.length;
  const frames = [];
  let comparisons = 0;

  const defaults = (sortedUpTo) =>
    arr.map((_, i) => (i < sortedUpTo ? C_SORTED : C_DEFAULT));

  frames.push({
    bars: [...arr],
    colors: defaults(0),
    description: 'Selection Sort: find the minimum and place it at the front, pass by pass.',
    comparisons,
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    const scanColors = defaults(i);
    scanColors[minIdx] = C_SWAP;

    frames.push({
      bars: [...arr],
      colors: scanColors,
      description: `Pass ${i + 1}: scanning positions ${i}–${n - 1} for the minimum.`,
      comparisons,
    });

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      const cmp = defaults(i);
      cmp[minIdx] = C_SWAP;
      cmp[j] = C_COMPARE;

      frames.push({
        bars: [...arr],
        colors: cmp,
        description: `Comparing current min ${arr[minIdx]} (idx ${minIdx}) with ${arr[j]} (idx ${j}).`,
        comparisons,
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        const newMin = defaults(i);
        newMin[minIdx] = C_SWAP;
        frames.push({
          bars: [...arr],
          colors: newMin,
          description: `New minimum found: ${arr[minIdx]} at index ${minIdx}.`,
          comparisons,
        });
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      const swapColors = defaults(i);
      swapColors[i] = C_SWAP;
      swapColors[minIdx] = C_SWAP;
      frames.push({
        bars: [...arr],
        colors: swapColors,
        description: `Placing minimum (${arr[i]}) at index ${i}.`,
        comparisons,
      });
    }

    frames.push({
      bars: [...arr],
      colors: defaults(i + 1),
      description: `Index ${i} locked in (value: ${arr[i]}).`,
      comparisons,
    });
  }

  frames.push({
    bars: [...arr],
    colors: Array(n).fill(C_SORTED),
    description: 'Selection Sort complete!',
    comparisons,
  });

  return frames;
}

/**
 * Build Binary Search frames on a pre-sorted array.
 * @param {number[]} sorted
 * @param {number}   target
 * @returns {Array<{bars: number[], colors: string[], description: string, comparisons: number}>}
 */
export function buildBinarySearchFrames(sorted, target) {
  const arr = [...sorted];
  const n = arr.length;
  const frames = [];
  let comparisons = 0;

  const makeColors = (lo, hi, mid) =>
    arr.map((_, i) => {
      if (i === mid) return C_SWAP;
      if (i >= lo && i <= hi) return C_COMPARE;
      return C_DIMMED;
    });

  frames.push({
    bars: [...arr],
    colors: Array(n).fill(C_DEFAULT),
    description: `Binary Search: looking for ${target} in a sorted array of ${n} elements.`,
    comparisons,
  });

  let lo = 0;
  let hi = n - 1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    comparisons++;

    frames.push({
      bars: [...arr],
      colors: makeColors(lo, hi, mid),
      description: `Search range [${lo}–${hi}]. Checking mid index ${mid} (value: ${arr[mid]}).`,
      comparisons,
    });

    if (arr[mid] === target) {
      const found = arr.map((_, i) => (i === mid ? C_SORTED : C_DIMMED));
      frames.push({
        bars: [...arr],
        colors: found,
        description: `Found ${target} at index ${mid} after ${comparisons} comparison(s)!`,
        comparisons,
      });
      return frames;
    } else if (arr[mid] < target) {
      frames.push({
        bars: [...arr],
        colors: makeColors(lo, hi, mid),
        description: `${arr[mid]} < ${target}. Discard left half — new range [${mid + 1}–${hi}].`,
        comparisons,
      });
      lo = mid + 1;
    } else {
      frames.push({
        bars: [...arr],
        colors: makeColors(lo, hi, mid),
        description: `${arr[mid]} > ${target}. Discard right half — new range [${lo}–${mid - 1}].`,
        comparisons,
      });
      hi = mid - 1;
    }
  }

  frames.push({
    bars: [...arr],
    colors: Array(n).fill(C_DIMMED),
    description: `${target} is not in this array. Search exhausted.`,
    comparisons,
  });

  return frames;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function randomArray(n = 20) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 98) + 8);
}

function sortedCopy(arr) {
  return [...arr].sort((a, b) => a - b);
}

const SPEED_MS = { slow: 720, medium: 280, fast: 75 };

const TABS = [
  { id: 'bubble',    label: 'Bubble Sort',    complexity: 'O(n²) time · O(1) space' },
  { id: 'selection', label: 'Selection Sort', complexity: 'O(n²) time · O(1) space' },
  { id: 'binary',    label: 'Binary Search',  complexity: 'O(log n) time · O(1) space' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function DSAVisualizer() {
  const [sectionRef, visible] = useIntersection(0.1);

  const [tab, setTab]           = useState('bubble');
  const [rawArray, setRawArray] = useState(() => randomArray());
  const [frames, setFrames]     = useState([]);
  const [frameIdx, setFrameIdx] = useState(0);
  const [playing, setPlaying]   = useState(false);
  const [speed, setSpeed]       = useState('medium');
  const [bsTarget, setBsTarget] = useState(null);

  const timerRef = useRef(null);

  // Build frames whenever tab or array changes
  useEffect(() => {
    setPlaying(false);
    clearInterval(timerRef.current);

    let f;
    if (tab === 'bubble') {
      f = buildBubbleSortFrames(rawArray);
    } else if (tab === 'selection') {
      f = buildSelectionSortFrames(rawArray);
    } else {
      const sorted = sortedCopy(rawArray);
      const pickExisting = Math.random() < 0.72;
      const target = pickExisting
        ? sorted[Math.floor(Math.random() * sorted.length)]
        : Math.floor(Math.random() * 105) + 8;
      setBsTarget(target);
      f = buildBinarySearchFrames(sorted, target);
    }

    setFrames(f);
    setFrameIdx(0);
  }, [tab, rawArray]); // eslint-disable-line react-hooks/exhaustive-deps

  // Playback ticker
  useEffect(() => {
    clearInterval(timerRef.current);
    if (!playing) return;

    timerRef.current = setInterval(() => {
      setFrameIdx((prev) => {
        if (prev >= frames.length - 1) {
          setPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, SPEED_MS[speed]);

    return () => clearInterval(timerRef.current);
  }, [playing, speed, frames.length]);

  const reset = useCallback(() => {
    setPlaying(false);
    clearInterval(timerRef.current);
    setRawArray(randomArray());
  }, []);

  const stepForward = useCallback(() => {
    setPlaying(false);
    clearInterval(timerRef.current);
    setFrameIdx((prev) => Math.min(prev + 1, frames.length - 1));
  }, [frames.length]);

  const togglePlay = useCallback(() => {
    if (frameIdx >= frames.length - 1) {
      setFrameIdx(0);
      setPlaying(true);
    } else {
      setPlaying((p) => !p);
    }
  }, [frameIdx, frames.length]);

  const currentFrame = frames[frameIdx] ?? {
    bars: rawArray,
    colors: Array(rawArray.length).fill(C_DEFAULT),
    description: '',
    comparisons: 0,
  };
  const maxBar = Math.max(...currentFrame.bars, 1);
  const atEnd  = frameIdx >= frames.length - 1 && frames.length > 1;
  const currentTab = TABS.find((t) => t.id === tab);

  return (
    <section
      id="dsa"
      ref={sectionRef}
      style={{
        padding: '8rem 8vw',
        background: 'var(--bg-900, #030712)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.7s ease',
      }}
      aria-label="Algorithms and Data Structures Visualizer"
    >
      {/* Heading */}
      <h2
        style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          color: 'var(--ink-100, #E8EDF5)',
          marginBottom: '0.5rem',
        }}
      >
        Algorithms &amp; <span style={{ color: 'var(--accent, #14b8a6)' }}>Data Structures</span>
      </h2>
      <p
        style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: '0.82rem',
          color: 'var(--ink-500, #6b7280)',
          marginBottom: '3rem',
          letterSpacing: '0.04em',
        }}
      >
        Pure algorithm logic rendered as step-by-step frames — play, pause, or step through.
      </p>

      {/* Card */}
      <div
        className="glass-card"
        style={{ padding: '2rem', maxWidth: '900px' }}
      >
        {/* Algorithm tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1.75rem',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
                padding: '0.42rem 1rem',
                borderRadius: '6px',
                border: `1px solid ${tab === id ? 'var(--accent, #14b8a6)' : 'rgba(255,255,255,0.1)'}`,
                background: tab === id ? 'rgba(0,255,178,0.08)' : 'transparent',
                color: tab === id ? 'var(--accent, #14b8a6)' : 'var(--ink-300, #9ca3af)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          ))}

          {tab === 'binary' && bsTarget !== null && (
            <span
              style={{
                marginLeft: 'auto',
                fontFamily: '"DM Mono", monospace',
                fontSize: '0.75rem',
                color: '#fbbf24',
              }}
            >
              target: <strong>{bsTarget}</strong>
            </span>
          )}
        </div>

        {/* Bar chart */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'stretch',
            gap: '3px',
            height: '180px',
            marginBottom: '1.25rem',
          }}
          role="img"
          aria-label={`Algorithm step ${frameIdx + 1} of ${frames.length}`}
        >
          {currentFrame.bars.map((val, i) => (
            <div
              key={i}
              title={`[${i}] = ${val}`}
              style={{
                flex: '1 1 0',
                minWidth: '5px',
                height: `${(val / maxBar) * 100}%`,
                background: currentFrame.colors[i] ?? C_DEFAULT,
                borderRadius: '3px 3px 0 0',
                transition: 'height 0.1s ease, background 0.12s ease',
                boxShadow:
                  currentFrame.colors[i] === C_COMPARE
                    ? '0 0 8px rgba(251,191,36,0.4)'
                    : currentFrame.colors[i] === C_SWAP
                    ? '0 0 8px rgba(239,68,68,0.4)'
                    : currentFrame.colors[i] === C_SORTED
                    ? '0 0 6px rgba(34,197,94,0.3)'
                    : 'none',
              }}
            />
          ))}
        </div>

        {/* Description box */}
        <div
          style={{
            minHeight: '3rem',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '8px',
            padding: '0.65rem 1rem',
            marginBottom: '1.5rem',
            fontFamily: '"DM Mono", monospace',
            fontSize: '0.77rem',
            color: 'var(--ink-200, #d1d5db)',
            lineHeight: '1.55',
          }}
        >
          {currentFrame.description || '\u00a0'}
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '1.5rem',
            fontFamily: '"DM Mono", monospace',
            fontSize: '0.72rem',
            color: 'var(--ink-500, #6b7280)',
          }}
        >
          <span>
            Step:{' '}
            <strong style={{ color: 'var(--accent, #14b8a6)' }}>
              {frameIdx + 1} / {frames.length}
            </strong>
          </span>
          <span>
            Comparisons:{' '}
            <strong style={{ color: 'var(--accent, #14b8a6)' }}>
              {currentFrame.comparisons}
            </strong>
          </span>
          <span style={{ marginLeft: 'auto' }}>
            {currentTab?.complexity}
          </span>
        </div>

        {/* Controls */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.65rem',
            alignItems: 'center',
          }}
        >
          <button onClick={togglePlay} style={primaryBtn()}>
            {playing ? '⏸ Pause' : atEnd ? '↩ Replay' : '▶ Play'}
          </button>

          <button
            onClick={stepForward}
            disabled={atEnd}
            style={secondaryBtn(atEnd)}
          >
            ⏭ Step
          </button>

          <button onClick={reset} style={secondaryBtn()}>
            ↺ New Array
          </button>

          {/* Speed selector */}
          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: '"DM Mono", monospace',
              fontSize: '0.72rem',
              color: 'var(--ink-400, #9ca3af)',
            }}
          >
            <label htmlFor="dsa-speed">Speed:</label>
            <select
              id="dsa-speed"
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '5px',
                color: 'var(--ink-100, #E8EDF5)',
                padding: '0.25rem 0.5rem',
                fontFamily: '"DM Mono", monospace',
                fontSize: '0.72rem',
                cursor: 'pointer',
              }}
            >
              <option value="slow">Slow</option>
              <option value="medium">Medium</option>
              <option value="fast">Fast</option>
            </select>
          </div>
        </div>

        {/* Color legend */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            marginTop: '1.5rem',
            fontFamily: '"DM Mono", monospace',
            fontSize: '0.68rem',
            color: 'var(--ink-500, #6b7280)',
          }}
        >
          {[
            { color: C_DEFAULT, label: 'Default' },
            { color: C_COMPARE, label: 'Comparing' },
            { color: C_SWAP,    label: tab === 'binary' ? 'Midpoint' : 'Swapping' },
            { color: C_SORTED,  label: tab === 'binary' ? 'Found' : 'Sorted' },
          ].map(({ color, label }) => (
            <span
              key={label}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  borderRadius: '2px',
                  background: color,
                }}
              />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Button style helpers
// ---------------------------------------------------------------------------
function primaryBtn() {
  return {
    fontFamily: '"DM Mono", monospace',
    fontSize: '0.75rem',
    padding: '0.48rem 1.15rem',
    borderRadius: '7px',
    border: 'none',
    background: 'var(--accent, #14b8a6)',
    color: '#000',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  };
}

function secondaryBtn(disabled = false) {
  return {
    fontFamily: '"DM Mono", monospace',
    fontSize: '0.75rem',
    padding: '0.48rem 1rem',
    borderRadius: '7px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.04)',
    color: disabled ? '#4b5563' : 'var(--ink-100, #E8EDF5)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'opacity 0.15s',
  };
}
