import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

const ffmpeg = new FFmpeg();
let isLoaded = false;

async function loadFFmpeg() {
    if (isLoaded) return;
    const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@0.12.10/dist/esm';
    await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
    });
    isLoaded = true;
}

self.onmessage = async (event: MessageEvent) => {
    const { id, file, outputType } = event.data;
    try {
        await loadFFmpeg();
        const fileData = await file.arrayBuffer();
        const inputName = `input_${id}`;
        const outputName = `output_${id}.${outputType}`;

        await ffmpeg.writeFile(inputName, new Uint8Array(fileData));
        await ffmpeg.exec(['-i', inputName, outputName]);
        const data = await ffmpeg.readFile(outputName);

        await ffmpeg.deleteFile(inputName);
        await ffmpeg.deleteFile(outputName);

        self.postMessage({
            id,
            status: 'completed',
            data: data as Uint8Array,
            outputType
        });
    } catch (error) {
        self.postMessage({ id, status: 'error', error: String(error) });
    }
};