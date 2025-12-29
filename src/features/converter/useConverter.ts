import { useState, useEffect, useCallback } from 'react';
import { getWorker } from './worker-client';
import type { ConvertedFile } from './types';
import { detectFileType, getAvailableFormats } from './utils';

export function useConverter() {
  const [files, setFiles] = useState<ConvertedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const worker = getWorker();
    const handleMessage = (event: MessageEvent) => {
      const { id, status, data, outputType, error } = event.data;
      
      setFiles((prev) => prev.map((f) => {
        if (f.id !== id) return f;
        if (status === 'completed') {
          const blob = new Blob([data], { type: outputType === 'mp4' ? 'video/mp4' : `image/${outputType}` });
          return { ...f, status: 'completed', url: URL.createObjectURL(blob), progress: 100 };
        }
        if (status === 'error') {
           return { ...f, status: 'error', errorMessage: error };
        }
        return f;
      }));
      setIsProcessing(false);
    };
    worker.addEventListener('message', handleMessage);
    return () => worker.removeEventListener('message', handleMessage);
  }, []);

  const addFile = useCallback((file: File) => {
    const id = crypto.randomUUID();
    const fileType = detectFileType(file);
    const defaultFormat = getAvailableFormats(fileType)[0]?.value || 'mp4';

    const newFile: ConvertedFile = {
      id,
      file,
      originalName: file.name,
      originalSize: file.size,
      fileName: file.name.replace(/\.[^/.]+$/, "") + `.${defaultFormat}`,
      outputType: defaultFormat,
      status: 'idle',
      progress: 0,
    };

    setFiles((prev) => [...prev, newFile]);
  }, []);

  const updateOutputFormat = useCallback((id: string, newFormat: string) => {
    setFiles((prev) => prev.map((f) => {
      if (f.id !== id) return f;
      return {
        ...f,
        outputType: newFormat,
        fileName: f.originalName.replace(/\.[^/.]+$/, "") + `.${newFormat}`
      };
    }));
  }, []);

  const startConversion = useCallback((id: string) => {
    const fileToConvert = files.find(f => f.id === id);
    if (!fileToConvert) return;

    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'converting' } : f));
    setIsProcessing(true);

    const worker = getWorker();
    worker.postMessage({ 
      id: fileToConvert.id, 
      file: fileToConvert.file, 
      outputType: fileToConvert.outputType 
    });
  }, [files]);

  return { files, isProcessing, addFile, updateOutputFormat, startConversion };
}