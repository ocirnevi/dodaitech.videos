import {Config} from '@remotion/cli/config';

// Three.js no renderiza bien con el OpenGL por defecto de Chromium headless.
Config.setChromiumOpenGlRenderer('angle');
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setConcurrency(4);

// El chrome-headless-shell que descarga Remotion falla en esta máquina
// ("icudtl.dat not found in bundle"); usamos el Chrome del sistema.
if (process.platform === 'darwin') Config.setBrowserExecutable('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
else if (process.env.CHROME_PATH) Config.setBrowserExecutable(process.env.CHROME_PATH);
