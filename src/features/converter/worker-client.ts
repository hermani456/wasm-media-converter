import Worker from './ffmpeg.worker?worker';

let worker: Worker | null = null;

export function getWorker(): Worker {
    if (!worker) {
        worker = new Worker();

        worker.onerror = (err) => console.error('Worker Error:', err);
    }
    return worker;
}

export function terminateWorker() {
    if (worker) {
        worker.terminate();
        worker = null;
    }
}