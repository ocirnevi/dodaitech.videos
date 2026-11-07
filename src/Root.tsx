import {Composition, staticFile} from 'remotion';
import {Manifest, SHEET_W, sheetLayout, StoryboardSheet} from './StoryboardSheet';
import {AiIceberg} from './shorts/AiIceberg';
import {SHORT, buildShortTimeline} from './shorts/script';
import {ChipSupplyChain} from './Video';
import {buildTimeline, FPS, HEIGHT, WIDTH} from './script';

export const RemotionRoot: React.FC = () => {
  const {totalFrames} = buildTimeline();
  const short = buildShortTimeline();
  return (
    <>
    <Composition id="AiIceberg" component={AiIceberg} durationInFrames={short.totalFrames} fps={SHORT.fps} width={SHORT.width} height={SHORT.height} defaultProps={{flat: false}} />
    <Composition id="AiIcebergV3" component={AiIceberg} durationInFrames={short.totalFrames} fps={SHORT.fps} width={SHORT.width} height={SHORT.height} defaultProps={{flat: false, v3: true}} />
    <Composition id="AiIceberg2D" component={AiIceberg} durationInFrames={short.totalFrames} fps={SHORT.fps} width={SHORT.width} height={SHORT.height} defaultProps={{flat: true}} />
    <Composition
      id="ChipSupplyChain"
      component={ChipSupplyChain}
      durationInFrames={totalFrames}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
      <Composition
        id="StoryboardSheet"
        component={StoryboardSheet}
        durationInFrames={1}
        fps={1}
        width={SHEET_W}
        height={1440}
        defaultProps={{manifest: 'storyboard/manifest.json'}}
        calculateMetadata={async ({props}) => {
          const res = await fetch(staticFile(props.manifest));
          if (!res.ok) return {props};
          const data = (await res.json()) as Manifest;
          return {props: {...props, data}, height: sheetLayout(data).height};
        }}
      />
    </>
  );
};
