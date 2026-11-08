import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import {useMemo} from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Word} from '../script';
import {Mode, theme, useBrand, usePalette} from '../theme';

/** Subtítulos karaoke: páginas de 2–4 palabras, palabra activa en naranja. Tiempos de faster-whisper alineados al guion. */
export const Captions: React.FC<{words: Word[]; mode: Mode; bottom?: number; fontSize?: number; combineMs?: number; maxWidth?: number}> = ({words, mode, bottom = 84, fontSize = 46, combineMs = 1100, maxWidth = 1400}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const brand = useBrand();
  const p = usePalette(mode);
  const pages = useMemo(() => {
    const captions: Caption[] = words.map((w) => ({text: ` ${w.word}`, startMs: w.start * 1000, endMs: w.end * 1000, timestampMs: w.start * 1000, confidence: null, pageBreakAfter: /[.!?:]$/.test(w.word)}));
    return createTikTokStyleCaptions({captions, combineTokensWithinMilliseconds: combineMs}).pages;
  }, [words, combineMs]);
  const nowMs = (frame / fps) * 1000;
  const page = pages.find((pg) => nowMs >= pg.startMs && nowMs < pg.startMs + pg.durationMs);
  if (!page) return null;
  const local = frame - Math.round((page.startMs / 1000) * fps);
  const s = spring({frame: local, fps, config: theme.spring.snappy, durationInFrames: 10});
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom,
        display: 'flex',
        justifyContent: 'center',
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [14, 0])}px) scale(${interpolate(s, [0, 1], [0.96, 1])})`,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 14,
          padding: '14px 30px',
          borderRadius: 16,
          background: mode === 'dark' ? 'rgba(21,19,17,0.82)' : 'rgba(251,251,249,0.9)',
          border: `1px solid ${p.line}`,
          boxShadow: mode === 'light' ? '0 10px 30px rgba(27,25,23,0.08)' : 'none',
          fontSize,
          fontWeight: 600,
          maxWidth,
          flexWrap: 'wrap',
          justifyContent: 'center',
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
        }}
      >
        {page.tokens.map((t, i) => {
          const active = nowMs >= t.fromMs && nowMs < t.toMs;
          const done = nowMs >= t.toMs;
          return (
            <span key={i} style={{color: active ? brand.accent : done ? p.text : p.text3, transform: `scale(${active ? 1.06 : 1})`, display: 'inline-block'}}>
              {t.text.trim()}
            </span>
          );
        })}
      </div>
    </div>
  );
};
