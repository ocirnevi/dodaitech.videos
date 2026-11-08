import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Mode, theme, useBrand, usePalette} from '../theme';

export const Chapter: React.FC<{label: string; title: string; subtitle?: string; mode: Mode; top?: number; titleSize?: number; width?: number}> = ({label, title, subtitle, mode, top = 88, titleSize = 124, width = 900}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const brand = useBrand();
  const p = usePalette(mode);
  const sp = (d: number) => spring({frame: frame - d, fps, config: theme.spring.snappy, durationInFrames: 14});
  const enter = (s: number): React.CSSProperties => ({opacity: s, transform: `translateX(${interpolate(s, [0, 1], [-36, 0])}px)`, transformOrigin: 'left center'});
  return (
    <div style={{position: 'absolute', left: 96, top, width, display: 'flex', flexDirection: 'column', gap: 12}}>
      <div style={{...enter(sp(0)), ...theme.label, fontSize: 24, color: brand.accent, display: 'flex', alignItems: 'center', gap: 14}}>
        <span style={{width: 36, height: 2, background: brand.accent, display: 'inline-block'}} />
        {label}
      </div>
      <div style={{...enter(sp(4)), ...theme.display, fontSize: titleSize, color: p.text}}>{title}</div>
      {subtitle ? <div style={{...enter(sp(9)), fontSize: 34, color: p.text2, fontWeight: 400, maxWidth: 760}}>{subtitle}</div> : null}
    </div>
  );
};
