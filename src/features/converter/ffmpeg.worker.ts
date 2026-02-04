import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';
import { FFMPEG_CORE_VERSION } from './types';
import type { WorkerRequest } from './types';

const ffmpeg = new FFmpeg();
let isLoaded = false;

async function loadFFmpeg() {
    if (isLoaded) return;
    const baseURL = `https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@${FFMPEG_CORE_VERSION}/dist/esm`;
    await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
    });
    isLoaded = true;
    self.postMessage({ type: 'loaded' });
}

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
    const { data } = event;

    if (data.type === 'load') {
        try {
            await loadFFmpeg();
        } catch (error) {
            console.error('Failed to load FFmpeg', error);
        }
        return;
    }

    if (data.type === 'convert') {
        const { id, file, outputType } = data;
        try {
            await loadFFmpeg();
            const fileData = await file.arrayBuffer();
            const inputName = `input_${id}`;
            const outputName = `output_${id}.${outputType}`;

            await ffmpeg.writeFile(inputName, new Uint8Array(fileData));
            await ffmpeg.exec(['-i', inputName, outputName]);
            const outputData = await ffmpeg.readFile(outputName);

            await ffmpeg.deleteFile(inputName);
            await ffmpeg.deleteFile(outputName);

            self.postMessage({
                id,
                status: 'completed',
                data: outputData as Uint8Array,
                outputType
            });
        } catch (error) {
            self.postMessage({ id, status: 'error', error: String(error) });
        }
    }
};