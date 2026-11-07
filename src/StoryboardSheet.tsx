import {AbsoluteFill, Img, staticFile} from 'remotion';
import {brand, theme} from './theme';

export type Panel = {n: number; src: string; frame: number; time: string; scene: string; label: string; caption: string};
export type Manifest = {title: string; comp: string; width: number; height: number; cols: number; panels: Panel[]};

export const SHEET_W = 2560;
const PAD = 48;
const GAP = 28;
const LABEL_H = 118;
const HEADER = 120;

export const sheetLayout = (m: Manifest) => {
  const cols = m.cols;
  const cellW = (SHEET_W - PAD * 2 - GAP * (cols - 1)) / cols;
  const imgH = cellW * (m.height / m.width);
  const cellH = imgH + LABEL_H;
  const rows = Math.ceil(m.panels.length / cols);
  return {cols, cellW, imgH, cellH, rows, height: Math.round(HEADER + PAD * 2 + rows * cellH + (rows - 1) * GAP)};
};

/** Hoja de storyboard: retícula numerada de frames reales. Se renderiza con scripts/storyboard.mjs. */
export const StoryboardSheet: React.FC<{manifest: string; data?: Manifest}> = ({data}) => {
  if (!data) return <AbsoluteFill style={{background: brand.canvas}} />;
  const L = sheetLayout(data);
  return (
    <AbsoluteFill style={{background: brand.canvas, fontFamily: theme.font, color: brand.ink, padding: PAD}}>
      <div style={{height: HEADER, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{...theme.display, fontSize: 56}}>{data.title}</div>
        <div style={{...theme.label, fontSize: 22, color: brand.ink3}}>
          storyboard · {data.comp} · {data.panels.length} paneles · comenta por número (#3: …)
        </div>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: `repeat(${L.cols}, ${L.cellW}px)`, gap: GAP}}>
        {data.panels.map((p) => (
          <div key={p.n} style={{width: L.cellW}}>
            <div style={{position: 'relative', width: L.cellW, height: L.imgH, borderRadius: 14, overflow: 'hidden', background: brand.soot, boxShadow: '0 10px 30px rgba(27,25,23,0.12)'}}>
              <Img src={staticFile(p.src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              <div style={{position: 'absolute', left: 14, bottom: 14, background: brand.accent, color: '#fff', fontWeight: 700, fontSize: 28, padding: '4px 14px', borderRadius: 10}}>#{p.n}</div>
              <div style={{position: 'absolute', right: 14, top: 14, background: 'rgba(21,19,17,0.75)', color: brand.onSoot, fontSize: 22, padding: '4px 12px', borderRadius: 8, fontVariantNumeric: 'tabular-nums'}}>{p.time}s · f{p.frame}</div>
            </div>
            <div style={{height: LABEL_H, paddingTop: 10}}>
              <div style={{...theme.label, fontSize: 20, color: brand.accentDeep}}>{p.scene} · {p.label}</div>
              <div style={{fontSize: 22, color: brand.ink2, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{p.caption}</div>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
