import { useState, useEffect, useCallback, useRef } from 'react';
import { getWorker } from './worker-client';
import type { ConvertedFile, WorkerResponse } from './types';
import { detectFileType, getAvailableFormats } from './utils';

export function useConverter() {
  const [files, setFiles] = useState<ConvertedFile[]>([]);
  const isProcessing = files.some(f => f.status === 'converting');
  
  // keep track of object URLs to revoke them
  const objectUrlsRef = useRef<Set<string>>(new Set());

  // cleanup object URLs on unmount
  useEffect(() => {
    const urls = objectUrlsRef.current;
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);



  useEffect(() => {
    const worker = getWorker();
    
    // initialize worker
    worker.postMessage({ type: 'load' });

    const handleMessage = (event: MessageEvent<WorkerResponse>) => {
      const response = event.data;

      if ('type' in response && response.type === 'loaded') {
         console.log('FFmpeg loaded');
         return;
      }

      if ('status' in response) {
        const { id, status } = response;
        
        setFiles((prev) => prev.map((f) => {
          if (f.id !== id) return f;
          
          if (status === 'completed') {
            const { data, outputType } = response as Extract<WorkerResponse, { status: 'completed' }>;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const blob = new Blob([data as any], { type: outputType === 'mp4' ? 'video/mp4' : `image/${outputType}` });
            const url = URL.createObjectURL(blob);
            objectUrlsRef.current.add(url);
            
            return { ...f, status: 'completed', url, progress: 100 };
          }
          
          if (status === 'error') {
             const { error } = response as Extract<WorkerResponse, { status: 'error' }>;
             return { ...f, status: 'error', errorMessage: error };
          }
          return f;
        }));
      }
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

    const worker = getWorker();
    worker.postMessage({ 
      type: 'convert',
      id: fileToConvert.id, 
      file: fileToConvert.file, 
      outputType: fileToConvert.outputType 
    });
  }, [files]);
  
  const removeFile = useCallback((id: string) => {
      setFiles(prev => {
          const file = prev.find(f => f.id === id);
          if (file?.url) {
              URL.revokeObjectURL(file.url);
              objectUrlsRef.current.delete(file.url);
          }
          return prev.filter(f => f.id !== id);
      });
  }, []);

  return { files, isProcessing, addFile, updateOutputFormat, startConversion, removeFile };
}