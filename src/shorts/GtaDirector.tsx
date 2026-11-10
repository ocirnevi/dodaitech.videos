import {Audio} from '@remotion/media';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import {useMemo} from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, Track, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import wordsJson from '../data/gta-director/words.json';
import {MusicBed} from '../components/MusicBed';
import {Sfx} from '../components/Sfx';
import {brand, dodaitech, theme} from '../theme';
import type {Word} from '../script';
import {Race, type RaceView} from './gta/race';
import {CrimeBox, DecisionTree, EdgeCover, FamilyIcons, FlashHit, GlowWord, HeroBeat, LeonidaMap, MissionCard, NelsonCard, PaperDoc, PinkPill, Poll, Reticle, Speedo, Stars, TrafficLight, WalletBeat} from './gta/overlays';

/**
 * Private capability test: match the Lonutico GTA VI short (subs + trailer footage + motion graphics)
 * in English with the supplied Alex narration. Not for publish. 2D vector cars, not low-poly 3D.
 * The Alex mp3 is used as-is so the ElevenLabs word timestamps stay locked (no tighten-narration).
 */
const WORDS = wordsJson as Word[];
export const FPS = 30;
export const TOTAL_FRAMES = 2112; // 70.4s
const OUTRO_AT = Math.round(68.25 * FPS);

const T1 = 'footage/gta-director/trailer1.mp4';
const T2 = 'footage/gta-director/trailer2.mp4';

type Footage = {kind: 'footage'; src: string; at: number; pos: string; zoom?: number};
type Bg =
  | Footage
  | {kind: 'cars'; view: RaceView}
  | {kind: 'paper'}
  | {kind: 'mission'}
  | {kind: 'edge'}
  | {kind: 'map'}
  | {kind: 'tree'}
  | {kind: 'wallet'};

type Fx = 'stars' | 'crime' | 'family' | 'speedo' | 'light' | 'reticle' | 'hero' | 'poll' | 'nelson';

type Shot = {
  id: string;
  t0: number;
  bg: Bg;
  glow?: string;
  pill?: string;
  fx?: Fx[];
  glitch?: boolean;
  bass?: boolean;
};

const SHOTS: Shot[] = [
  {id: 'hook', t0: 0, bg: {kind: 'footage', src: T1, at: 12, pos: '50% 46%', zoom: 1.22}, glow: 'WRECKED', bass: true, glitch: true},
  {id: 'inside', t0: 1.45, bg: {kind: 'footage', src: T1, at: 30, pos: '48% 50%'}, glow: 'EXPOSED'},
  {id: 'title', t0: 2.55, bg: {kind: 'footage', src: T1, at: 18, pos: '50% 42%', zoom: 1.24}, glow: 'VI', glitch: true},
  {id: 'paper', t0: 3.7, bg: {kind: 'paper'}, pill: 'SIGNED OFF', bass: true},
  {id: 'playtest', t0: 5.3, bg: {kind: 'footage', src: T1, at: 60, pos: '62% 42%'}, pill: 'HIMSELF'},
  {id: 'cops', t0: 6.85, bg: {kind: 'footage', src: T1, at: 45, pos: '50% 48%'}, fx: ['stars']},
  {id: 'crime', t0: 8.15, bg: {kind: 'footage', src: T1, at: 69, pos: '52% 40%'}, fx: ['crime'], bass: true},
  {id: 'wagon', t0: 9.4, bg: {kind: 'footage', src: T2, at: 15, pos: '46% 55%'}, fx: ['family'], pill: 'BEATER'},
  {id: 'getaway', t0: 10.4, bg: {kind: 'cars', view: 'top'}, pill: 'THE GETAWAY'},
  {id: 'arrive', t0: 11.7, bg: {kind: 'cars', view: 'side'}, glow: 'NEON'},
  {id: 'glow', t0: 13.05, bg: {kind: 'cars', view: 'wheels'}, bass: true},
  {id: 'beside', t0: 14.35, bg: {kind: 'cars', view: 'side'}, pill: 'SIDE BY SIDE'},
  {id: 'window', t0: 15.5, bg: {kind: 'cars', view: 'window'}},
  {id: 'taunt', t0: 16.85, bg: {kind: 'cars', view: 'side'}, pill: 'THE PAIR'},
  {id: 'light', t0: 18.15, bg: {kind: 'cars', view: 'top'}, fx: ['light'], bass: true},
  {id: 'nelson', t0: 19.5, bg: {kind: 'footage', src: T2, at: 25, pos: '70% 48%'}, fx: ['nelson']},
  {id: 'keep', t0: 21.0, bg: {kind: 'footage', src: T2, at: 20, pos: '55% 50%'}},
  {id: 'react', t0: 22.4, bg: {kind: 'footage', src: T1, at: 33, pos: '50% 45%'}, pill: 'PUSHBACK', glitch: true},
  {id: 'unseen', t0: 23.9, bg: {kind: 'footage', src: T2, at: 75, pos: '50% 45%'}, glow: 'UNSEEN'},
  {id: 'box', t0: 25.1, bg: {kind: 'cars', view: 'top'}, pill: 'PINNED', bass: true, glitch: true},
  {id: 'forced', t0: 26.55, bg: {kind: 'cars', view: 'front'}, pill: 'FORCED'},
  {id: 'floor', t0: 28.0, bg: {kind: 'cars', view: 'side'}, fx: ['speedo'], bass: true},
  {id: 'nochance', t0: 29.55, bg: {kind: 'cars', view: 'side'}, fx: ['speedo'], pill: 'OUTMATCHED'},
  {id: 'pass', t0: 31.15, bg: {kind: 'cars', view: 'pass'}, glow: 'OVERTAKE', bass: true},
  {id: 'lean', t0: 32.8, bg: {kind: 'cars', view: 'lean'}},
  {id: 'face', t0: 34.4, bg: {kind: 'cars', view: 'lean'}, glow: 'TAUNT'},
  {id: 'twist', t0: 36.1, bg: {kind: 'footage', src: T2, at: 110, pos: '58% 42%'}, glow: 'THE TWIST'},
  {id: 'mission', t0: 37.55, bg: {kind: 'mission'}, bass: true, glitch: true},
  {id: 'edge', t0: 39.15, bg: {kind: 'edge'}, pill: 'THE ISSUE'},
  {id: 'shift', t0: 40.7, bg: {kind: 'footage', src: T1, at: 54, pos: '48% 50%'}, pill: 'THE SHIFT'},
  {id: 'aerial', t0: 42.15, bg: {kind: 'footage', src: T2, at: 5, pos: '50% 48%'}, glow: 'NEW COAST'},
  {id: 'map', t0: 43.7, bg: {kind: 'map'}, bass: true},
  {id: 'tree', t0: 45.3, bg: {kind: 'tree'}},
  {id: 'ruin', t0: 46.8, bg: {kind: 'footage', src: T2, at: 85, pos: '50% 48%'}, pill: 'DETOUR', glitch: true},
  {id: 'wallet', t0: 48.25, bg: {kind: 'wallet'}, bass: true},
  {id: 'chase', t0: 49.8, bg: {kind: 'footage', src: T2, at: 20, pos: '50% 52%'}, glow: 'HUNTED'},
  {id: 'store', t0: 51.3, bg: {kind: 'footage', src: T2, at: 45, pos: '50% 42%'}},
  {id: 'counter', t0: 52.9, bg: {kind: 'footage', src: T2, at: 55, pos: '48% 42%'}, fx: ['hero']},
  {id: 'hero', t0: 54.5, bg: {kind: 'footage', src: T1, at: 69, pos: '50% 38%'}, fx: ['hero'], bass: true},
  {id: 'plan', t0: 56.05, bg: {kind: 'footage', src: T1, at: 12, pos: '50% 45%'}, glow: 'NO PROMISE'},
  {id: 'reticle', t0: 57.6, bg: {kind: 'footage', src: T2, at: 145, pos: '55% 45%'}, fx: ['reticle'], glitch: true},
  {id: 'way', t0: 59.2, bg: {kind: 'footage', src: T1, at: 36, pos: '50% 48%'}, fx: ['reticle']},
  {id: 'exit', t0: 60.85, bg: {kind: 'footage', src: T2, at: 120, pos: '50% 48%'}, pill: 'NO EXIT'},
  {id: 'ask', t0: 62.45, bg: {kind: 'footage', src: T2, at: 125, pos: '50% 42%'}},
  {id: 'choice', t0: 64.05, bg: {kind: 'footage', src: T1, at: 27, pos: '48% 45%'}, glow: 'YOUR CALL'},
  {id: 'poll', t0: 65.7, bg: {kind: 'footage', src: T2, at: 100, pos: '50% 40%'}, fx: ['poll'], bass: true},
];

const shotFrom = (i: number) => Math.round(SHOTS[i].t0 * FPS);
const shotDur = (i: number) => (i + 1 < SHOTS.length ? shotFrom(i + 1) : OUTRO_AT) - shotFrom(i);

const FootageBg: React.FC<{src: string; at: number; pos: string; zoom?: number}> = ({src, at, pos, zoom = 1.32}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const z = interpolate(frame, [0, Math.max(1, durationInFrames)], [zoom, zoom + 0.08], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <OffthreadVideo muted src={staticFile(src)} startFrom={Math.round(at * FPS)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${z})`}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.05) 28%, rgba(0,0,0,0.25) 58%, rgba(0,0,0,0.55) 100%)'}} />
    </AbsoluteFill>
  );
};

const ShotBody: React.FC<{shot: Shot; spoken: string}> = ({shot, spoken}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = shot.t0 + frame / fps;
  const bg = shot.bg;
  return (
    <AbsoluteFill>
      {bg.kind === 'footage' ? <FootageBg src={bg.src} at={bg.at} pos={bg.pos} zoom={bg.zoom} /> : null}
      {bg.kind === 'cars' ? <Race view={bg.view} t={t} /> : null}
      {bg.kind === 'paper' ? <PaperDoc spoken={spoken} /> : null}
      {bg.kind === 'mission' ? <MissionCard spoken={spoken} /> : null}
      {bg.kind === 'edge' ? <EdgeCover spoken={spoken} /> : null}
      {bg.kind === 'map' ? <LeonidaMap /> : null}
      {bg.kind === 'tree' ? <DecisionTree /> : null}
      {bg.kind === 'wallet' ? <WalletBeat /> : null}
      {shot.fx?.includes('stars') ? <Stars /> : null}
      {shot.fx?.includes('crime') ? <CrimeBox spoken={spoken} /> : null}
      {shot.fx?.includes('family') ? <FamilyIcons /> : null}
      {shot.fx?.includes('speedo') ? <Speedo t={t} /> : null}
      {shot.fx?.includes('light') ? <TrafficLight t={t} /> : null}
      {shot.fx?.includes('reticle') ? <Reticle /> : null}
      {shot.fx?.includes('hero') ? <HeroBeat spoken={spoken} /> : null}
      {shot.fx?.includes('poll') ? <Poll /> : null}
      {shot.fx?.includes('nelson') ? <NelsonCard spoken={spoken} /> : null}
      {shot.glow ? <GlowWord text={shot.glow} spoken={spoken} /> : null}
      {shot.pill ? <PinkPill text={shot.pill} spoken={spoken} /> : null}
      <FlashHit glitch={shot.glitch} />
    </AbsoluteFill>
  );
};

const captionPages = (words: Word[]) =>
  createTikTokStyleCaptions({
    captions: words.map(
      (w): Caption => ({
        text: ` ${w.word}`,
        startMs: w.start * 1000,
        endMs: w.end * 1000,
        timestampMs: w.start * 1000,
        confidence: null,
        pageBreakAfter: /[.!?,]$/.test(w.word),
      }),
    ),
    combineTokensWithinMilliseconds: 520,
  }).pages;

const Karaoke: React.FC<{words: Word[]}> = ({words}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pages = useMemo(() => captionPages(words), [words]);
  const now = (frame / fps) * 1000;
  const page = pages.find((p) => now >= p.startMs && now < p.startMs + p.durationMs);
  if (!page || frame >= OUTRO_AT) return null;
  const local = frame - Math.round((page.startMs / 1000) * fps);
  const s = spring({frame: local, fps, config: theme.spring.snappy, durationInFrames: 8});
  return (
    <div style={{position: 'absolute', left: 70, right: 70, top: 1180, display: 'flex', justifyContent: 'center', opacity: s, transform: `translateY(${interpolate(s, [0, 1], [10, 0])}px)`}}>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, maxWidth: 920}}>
        {page.tokens.map((token, i) => {
          const active = now >= token.fromMs && now < token.toMs;
          return (
            <span key={i} style={{fontFamily: theme.font, fontWeight: 800, fontSize: 68, letterSpacing: '-0.03em', lineHeight: 1.05, color: active ? '#ffe14a' : '#ffffff', textShadow: '0 2px 0 #000, 0 8px 18px rgba(0,0,0,0.85)', transform: `scale(${active ? 1.06 : 1})`, display: 'inline-block'}}>
              {token.text.trim()}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/** Texto de la página de karaoke en este frame, para no repetirlo en pills ni titulares. */
const useSpoken = (words: Word[]) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pages = useMemo(() => captionPages(words), [words]);
  const now = (frame / fps) * 1000;
  const page = pages.find((p) => now >= p.startMs && now < p.startMs + p.durationMs);
  return page ? page.tokens.map((t) => t.text).join(' ') : '';
};

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`,
        backgroundSize: '180px',
        backgroundPosition: `${(frame * 7) % 180}px ${(frame * 11) % 180}px`,
        opacity: 0.09,
        mixBlendMode: 'overlay',
      }}
    />
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: theme.spring.snappy, durationInFrames: 16});
  return (
    <AbsoluteFill style={{background: brand.soot, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: s, transform: `translateY(${interpolate(s, [0, 1], [24, 0])}px) scale(${interpolate(s, [0, 1], [0.92, 1])})`}}>
        <Img src={staticFile(dodaitech.logo)} style={{width: 140, height: 140}} />
        <div style={{fontFamily: dodaitech.font, fontWeight: 600, fontSize: 72, letterSpacing: '-0.035em', color: brand.onSoot}}>dodaitech</div>
        <div style={{...theme.label, fontSize: 28, color: brand.onSoot3}}>dodaitech.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const GtaDirector: React.FC = () => {
  const spoken = useSpoken(WORDS);
  return (
    <AbsoluteFill style={{background: '#07060a', fontFamily: theme.font}}>
      <Track name="shots">
        {SHOTS.map((shot, i) => (
          <Sequence key={shot.id} from={shotFrom(i)} durationInFrames={shotDur(i)} name={shot.id}>
            <ShotBody shot={shot} spoken={spoken} />
          </Sequence>
        ))}
      </Track>
      <Track name="captions">
        <Karaoke words={WORDS} />
      </Track>
      <Grain />
      <Sequence from={OUTRO_AT} durationInFrames={TOTAL_FRAMES - OUTRO_AT} name="outro">
        <Outro />
      </Sequence>
      <Audio src={staticFile('narration/gta-director/alex-vo-v1.mp3')} name="voice" />
      <MusicBed src="music/gta-director/bed.wav" scenes={[{from: 0, words: WORDS}]} totalFrames={TOTAL_FRAMES} base={0.16} duck={0.42} fadeOutFrames={18} />
      {SHOTS.map((shot, i) => (
        <AbsoluteFill key={`sfx-${shot.id}`}>
          <Sfx name="whoosh" at={shotFrom(i)} volume={0.22} />
          {shot.bass ? <Sfx name="bass" at={shotFrom(i)} volume={0.42} /> : null}
          {shot.glitch ? <Sfx name="lib/glitch" at={shotFrom(i)} volume={0.32} /> : null}
          {shot.bg.kind === 'paper' || shot.fx?.includes('poll') ? <Sfx name="pop" at={shotFrom(i) + 6} volume={0.4} /> : null}
        </AbsoluteFill>
      ))}
      <Sfx name="shimmer" at={OUTRO_AT} volume={0.35} />
    </AbsoluteFill>
  );
};

export const GTA_DIRECTOR = {fps: FPS, width: 1080, height: 1920, durationInFrames: TOTAL_FRAMES};
