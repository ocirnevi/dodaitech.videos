import {AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Scene3D} from '../three/Scene3D';
import {Wafer} from '../three/Wafer';
import {EuvMachine} from '../three/EuvMachine';
import {GpuDie} from '../three/GpuDie';
import {Background} from '../components/Background';
import {Beats, beatFrames} from '../components/Beats';
import {Captions} from '../components/Captions';
import {Chapter} from '../components/Chapter';
import {Cut} from '../components/Cut';
import {Post} from '../components/Post';
import {PunchIn} from '../components/PunchIn';
import {Sfx} from '../components/Sfx';
import {Wordmark} from '../components/Wordmark';
import {triggerFrameIn} from '../script';
import {brand, palette, theme} from '../theme';
import {CameraRig, Iceberg, Water, cameraFor, layerCenterY} from './Iceberg';
import {IcebergScene2D, useIconProgress} from './Iceberg2D';
import {OUTRO_FRAMES, SHORT, TimedShortScene, buildShortTimeline, makeSpeakingFn} from './script';

// Layout 9:16 dentro de la zona segura (texto entre y 290–1250): capítulo arriba, dato debajo, iceberg al centro-bajo, subtítulos ≈ y 1130.
const LAYOUT = {chapterTop: 300, beatsTop: 560, captionsBottom: 860};
const BEATS_LAYOUT = {left: 96, top: LAYOUT.beatsTop, width: 880, numberSize: 150, calloutSize: 44, labelSize: 32};

const useScene = (scenes: TimedShortScene[], frame: number) => {
  let cur = scenes[0];
  for (const s of scenes) if (frame >= s.from) cur = s;
  return cur;
};

/** Profundidad de cámara continua: salta de capa en capa con easing en los primeros 18 frames de cada escena. */
const depthAt = (scenes: TimedShortScene[], frame: number) => {
  let prev = scenes[0].depth;
  for (const s of scenes) {
    if (frame < s.from) break;
    const t = interpolate(frame - s.from, [0, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: theme.ease.outQuint});
    prev = prev + (s.depth - prev) * t;
  }
  return prev;
};

const Hook: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const p = palette('light');
  const sixAt = triggerFrameIn(scene.words, 'Six', fps, scene.id);
  const lines = ['The hidden world', 'behind ChatGPT'];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 96, top: 330}}>
        {lines.map((l, i) => {
          const s = spring({frame: frame + 10 - i * 3, fps, config: theme.spring.soft, durationInFrames: 22});
          return (
            <div key={l} style={{overflow: 'hidden', paddingBottom: '0.08em', marginBottom: '-0.08em'}}>
              <div style={{...theme.display, fontSize: 118, color: i === 1 ? brand.accent : p.text, transform: `translateY(${interpolate(s, [0, 1], [105, 0])}%)`, opacity: interpolate(s, [0, 1], [0.1, 1])}}>{l}</div>
            </div>
          );
        })}
        <div style={{marginTop: 26, fontSize: 38, color: p.text2, opacity: interpolate(frame, [12, 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
          OpenAI makes ChatGPT. Who makes it possible?
        </div>
      </div>
      <Beats scene={scene} layout={{...BEATS_LAYOUT, top: 640}} />
      <Sfx name="lib/glassy-snap" at={sixAt} volume={0.5} />
    </AbsoluteFill>
  );
};

const Layer: React.FC<{scene: TimedShortScene}> = ({scene}) => (
  <AbsoluteFill>
    <Chapter label={scene.label} title={scene.title} mode={scene.mode} top={LAYOUT.chapterTop} titleSize={96} width={900} />
    <Beats scene={scene} layout={BEATS_LAYOUT} />
  </AbsoluteFill>
);

const Turn: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const s = spring({frame: frame - 4, fps, config: theme.spring.snappy, durationInFrames: 16});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 96, top: 420, opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.92, 1])})`, transformOrigin: 'left center'}}>
        <div style={{...theme.label, fontSize: 26, color: brand.accent}}>— wait</div>
        <div style={{...theme.display, fontSize: 104, color: palette('dark').text, marginTop: 12}}>Nobody shows you this part.</div>
      </div>
    </AbsoluteFill>
  );
};

const Breath: React.FC<{scene: TimedShortScene}> = () => (
  <AbsoluteFill>
    <div style={{position: 'absolute', left: 96, right: 96, top: 440}}>
      <div style={{...theme.display, fontSize: 92, color: palette('dark').text2}}>And the machine that draws them?</div>
    </div>
  </AbsoluteFill>
);

const Payoff: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const restsAt = triggerFrameIn(scene.words, 'rests', fps, scene.id);
  const items = ['one machine', 'one factory', 'one design'];
  return (
    <AbsoluteFill>
      <Chapter label={scene.label} title="The bottom of the iceberg" mode="dark" top={LAYOUT.chapterTop} titleSize={88} width={900} />
      <Beats scene={scene} layout={BEATS_LAYOUT} endAt={restsAt} />
      {/* al final, las tres unidades grandes */}
      <div style={{position: 'absolute', left: 96, top: 560, display: 'flex', flexDirection: 'column', gap: 4, opacity: frame >= restsAt ? 1 : 0}}>
        {items.map((it, i) => {
          const s = spring({frame: frame - restsAt - i * 8, fps, config: theme.spring.snappy, durationInFrames: 14});
          return (
            <div key={it} style={{display: 'flex', alignItems: 'baseline', gap: 22, opacity: s, transform: `translateX(${interpolate(s, [0, 1], [-30, 0])}px)`}}>
              <span style={{...theme.display, fontSize: 112, lineHeight: 1, color: brand.accent, fontVariantNumeric: 'tabular-nums', width: 90}}>1</span>
              <span style={{...theme.display, fontSize: 56, color: palette('dark').text}}>{it.replace('one ', '')}</span>
            </div>
          );
        })}
      </div>
      {items.map((_, i) => (
        <Sfx key={i} name="lib/coin" at={restsAt + i * 8} volume={0.5} />
      ))}
    </AbsoluteFill>
  );
};

const Close: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const p = palette('light');
  const s = spring({frame, fps, config: theme.spring.snappy, durationInFrames: 12});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 96, top: 330}}>
        <div style={{...theme.display, fontSize: 118, color: p.text}}>The hidden world</div>
        <div style={{...theme.display, fontSize: 118, color: brand.accent}}>behind ChatGPT</div>
        <div style={{marginTop: 26, fontSize: 44, color: p.text, fontWeight: 600, opacity: s, transform: `translateY(${interpolate(s, [0, 1], [12, 0])}px)`}}>Not OpenAI.</div>
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: theme.spring.soft, durationInFrames: 18});
  return (
    <AbsoluteFill style={{background: brand.canvas, justifyContent: 'center', alignItems: 'center', opacity: interpolate(frame, [0, 6], [0, 1], {extrapolateRight: 'clamp'})}}>
      <div style={{transform: `scale(${interpolate(s, [0, 1], [0.9, 1])})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
        <Wordmark mode="light" opacity={1} size={64} />
        <div style={{...theme.label, fontSize: 26, color: brand.ink3}}>dodaitech.com</div>
      </div>
      <Sfx name="lib/twinkle" at={2} lead={0} volume={0.45} />
    </AbsoluteFill>
  );
};

export const AiIceberg: React.FC<{flat?: boolean}> = ({flat = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {scenes, outroFrom} = buildShortTimeline();
  const scene = useScene(scenes, frame);
  const speaking = makeSpeakingFn(scenes);
  const depth = depthAt(scenes, frame);
  // zoom-out del hook: desde "Six layers down" hasta el corte a la capa 1
  const hook = scenes[0];
  const sixAt = hook.from + triggerFrameIn(hook.words, 'Six', fps, hook.id);
  const zoom = interpolate(frame, [sixAt - 6, hook.durationInFrames - 2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: theme.ease.outQuint});
  const cam = cameraFor(depth, zoom);
  const activeLayer = Math.round(scene.depth);
  const inOutro = frame >= outroFrom;
  const payoffPulse = scene.kind === 'payoff' ? interpolate(frame - scene.from, [0, 3, 20], [1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
  const mode = scene.mode;
  const iconProgress = useIconProgress(scene.from);
  const punchBeats = scenes.flatMap((s) => [s.from, ...beatFrames(s, fps).map((b) => s.from + b)]);
  const musicVol = (f: number) => {
    const base = f < fps ? interpolate(f, [0, fps], [0.25, 0.3]) : 0.3;
    const duck = speaking(f) ? 0.45 : 1;
    const fade = interpolate(f, [outroFrom + OUTRO_FRAMES - 20, outroFrom + OUTRO_FRAMES], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    return base * duck * fade;
  };

  return (
    <AbsoluteFill style={{background: brand.soot, fontFamily: theme.font}}>
      <Audio src={staticFile(SHORT.music)} volume={musicVol} />
      {!inOutro ? (
        <>
          <Background mode={mode} />
          <PunchIn beats={punchBeats} amount={0.03} origin="50% 60%">
            {flat ? (
              <IcebergScene2D depth={depth} zoom={zoom} activeLayer={activeLayer} pulse={payoffPulse} light={mode === 'light'} iconKind={scene.kind === 'layer' || scene.kind === 'payoff' ? scene.id : undefined} iconProgress={iconProgress} />
            ) : (
              <Scene3D camera={{position: [0, 2, 16], fov: 50}}>
              <CameraRig y={cam.y} z={cam.z} lookY={cam.lookY} />
              <Iceberg activeLayer={activeLayer} visited={activeLayer} pulse={payoffPulse} />
              <Water opacity={mode === 'light' ? 0.55 : 0.9} />
              {scene.id === 'l5' ? (
                <group position={[2.5, layerCenterY(5) + 0.3, 3.6]} scale={0.42}>
                  <Wafer accent={brand.accent} layersFrom={scene.from + 10 - scene.from} layersTo={scene.audioFrames} />
                </group>
              ) : null}
              {scene.id === 'l6' || scene.id === 'breath' ? (
                <group position={[-2.3, layerCenterY(6) + 1.0, 3.4]} scale={0.36}>
                  <EuvMachine accent={brand.accent} />
                </group>
              ) : null}
              {scene.id === 'l6' ? (
                <group position={[2.5, layerCenterY(6) - 0.3, 3.6]} scale={0.4}>
                  <GpuDie accent={brand.accent} waveFrom={triggerFrameIn(scene.words, 'NVIDIA', fps, scene.id)} waveTo={triggerFrameIn(scene.words, 'rests', fps, scene.id)} />
                </group>
              ) : null}
              </Scene3D>
            )}
            {scenes.map((s) => (
              <Sequence key={s.id} from={s.from} durationInFrames={s.durationInFrames} name={s.id}>
                <Audio src={staticFile(s.audioSrc)} />
                {s.kind === 'hook' ? <Hook scene={s} fps={fps} /> : null}
                {s.kind === 'layer' ? <Layer scene={s} /> : null}
                {s.kind === 'turn' ? <Turn scene={s} fps={fps} /> : null}
                {s.kind === 'breath' ? <Breath scene={s} /> : null}
                {s.kind === 'payoff' ? <Payoff scene={s} fps={fps} /> : null}
                {s.kind === 'close' ? <Close scene={s} fps={fps} /> : null}
              </Sequence>
            ))}
          </PunchIn>
          <Post mode={mode} />
          {scenes.map((s) => (
            <Sequence key={`cap-${s.id}`} from={s.from} durationInFrames={s.durationInFrames} name={`captions:${s.id}`} layout="none">
              <Captions words={s.words} mode={s.mode} bottom={LAYOUT.captionsBottom} fontSize={60} combineMs={800} maxWidth={900} />
            </Sequence>
          ))}
          {/* cortes: cada escena menos la primera; el respiro entra sin golpe */}
          {scenes.slice(1).map((s) => (
            <Cut key={`cut-${s.id}`} at={s.from} strength={s.kind === 'breath' ? 0.2 : s.kind === 'payoff' ? 0.8 : 0.5} bass={s.kind !== 'breath'} whoosh={s.kind !== 'breath'} />
          ))}
          {/* riser que termina en el corte a la capa 4 (después del giro) */}
          <Sfx name="lib/bass-drop" at={1} lead={1} volume={0.6} />
          {/* zambullida bajo el agua al pasar del hook a la capa 1 */}
          <Sfx name="lib/submerge" at={scenes[1].from} lead={0} volume={0.7} />
          {/* giro: el hielo cruje; braam que termina en el corte a la capa 4 */}
          <Sfx name="lib/ice-crack" at={scenes.find((s) => s.id === 'turn')!.from + 4} lead={0} volume={0.6} />
          <Sfx name="lib/braam" at={scenes.find((s) => s.id === 'l4')!.from} lead={0} volume={0.45} />
          {/* respiro: un solo crujido lejano */}
          <Sfx name="lib/ice-snap" at={scenes.find((s) => s.id === 'breath')!.from + 6} lead={0} volume={0.35} />
          {/* payoff: acorde de impacto */}
          <Sfx name="lib/impact-chord" at={scenes.find((s) => s.id === 'l6')!.from} lead={1} volume={0.7} />
        </>
      ) : null}
      <Sequence from={outroFrom} durationInFrames={OUTRO_FRAMES} name="outro">
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
