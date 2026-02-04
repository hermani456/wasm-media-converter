export type ConversionStatus = 'idle' | 'converting' | 'completed' | 'error';

export interface ConverterAction {
  type: 'convert';
  file: File;
  toFormat: string;
}


export const FFMPEG_CORE_VERSION = '0.12.10';

export type WorkerRequest = 
  | { type: 'load' }
  | { type: 'convert'; id: string; file: File; outputType: string };

export type WorkerResponse = 
  | { id: string; status: 'completed'; data: Uint8Array; outputType: string }
  | { id: string; status: 'error'; error: string }
  | { type: 'loaded' };

export interface ConvertedFile {
  id: string;
  originalName: string;
  originalSize: number;
  fileName: string;
  file: File;
  outputType: string;
  status: ConversionStatus;
  progress: number;
  url?: string;
  errorMessage?: string;
}