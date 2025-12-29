export type ConversionStatus = 'idle' | 'converting' | 'completed' | 'error';

export interface ConverterAction {
  type: 'convert';
  file: File;
  toFormat: string;
}

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