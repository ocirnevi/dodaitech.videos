import {Composition, staticFile} from 'remotion';
import {Manifest, SHEET_W, sheetLayout, StoryboardSheet} from './StoryboardSheet';
import {AiIceberg} from './shorts/AiIceberg';
import {THREE_NM, ThreeNm, threeNmTimeline} from './shorts/ThreeNm';
import {AI_MEMORY, AiMemory, aiMemoryTimeline} from './shorts/AiMemory';
import {AI_AGENTS, AiAgents, aiAgentsTimeline} from './shorts/AiAgents';
import {HN_KIWIS, HnKiwis, hnKiwisTimeline} from './shorts/HnKiwis';
import {MN_KIWIS, MnKiwis, mnKiwisTimeline} from './shorts/MnKiwis';
import {SHORT, buildShortTimeline} from './shorts/script';
import {ChipSupplyChain} from './Video';
import {buildTimeline, FPS, HEIGHT, WIDTH} from './script';

export const RemotionRoot: React.FC = () => {
  const {totalFrames} = buildTimeline();
  const short = buildShortTimeline();
  const threeNm = threeNmTimeline();
  const aiMemory = aiMemoryTimeline();
  const aiAgents = aiAgentsTimeline();
  const hnKiwis = hnKiwisTimeline();
  const mnKiwis = mnKiwisTimeline();
  return (
    <>
    <Composition id="MnKiwis" component={MnKiwis} durationInFrames={mnKiwis.totalFrames} fps={MN_KIWIS.fps} width={MN_KIWIS.width} height={MN_KIWIS.height} />
    <Composition id="HnKiwis" component={HnKiwis} durationInFrames={hnKiwis.totalFrames} fps={HN_KIWIS.fps} width={HN_KIWIS.width} height={HN_KIWIS.height} />
    <Composition id="AiAgents" component={AiAgents} durationInFrames={aiAgents.totalFrames} fps={AI_AGENTS.fps} width={AI_AGENTS.width} height={AI_AGENTS.height} />
    <Composition id="AiMemory" component={AiMemory} durationInFrames={aiMemory.totalFrames} fps={AI_MEMORY.fps} width={AI_MEMORY.width} height={AI_MEMORY.height} />
    <Composition id="ThreeNm" component={ThreeNm} durationInFrames={threeNm.totalFrames} fps={THREE_NM.fps} width={THREE_NM.width} height={THREE_NM.height} />
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
