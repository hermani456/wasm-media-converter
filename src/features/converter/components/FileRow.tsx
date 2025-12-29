import type { ConvertedFile } from '../types';
import { detectFileType, getAvailableFormats } from '../utils';
import { FileVideo, FileAudio, Image as ImageIcon, CheckCircle, Loader2, Download, Play, AlertCircle } from 'lucide-react';

interface FileRowProps {
  fileData: ConvertedFile;
  onFormatChange: (id: string, format: string) => void;
  onConvert: (id: string) => void;
}

export function FileRow({ fileData, onFormatChange, onConvert }: FileRowProps) {
  const { id, fileName, originalName, originalSize, status, outputType, url, file, errorMessage } = fileData;
  
  const fileType = detectFileType(file);
  const availableFormats = getAvailableFormats(fileType);

  const size = (originalSize / (1024 * 1024)).toFixed(2) + ' MB';

  const Icon = fileType === 'audio' ? FileAudio : fileType === 'image' ? ImageIcon : FileVideo;

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
      
      <div className="flex items-center gap-4 w-1/3">
        <div className="p-2 bg-slate-100 rounded-lg">
          <Icon className="w-6 h-6 text-slate-600" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-slate-900 truncate" title={originalName}>{originalName}</p>
          <p className="text-xs text-slate-500">{size}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {status === 'idle' ? (
          <>
             <div className="flex items-center gap-2 text-sm text-slate-600">
               <span>Convert to:</span>
               <select 
                 value={outputType}
                 onChange={(e) => onFormatChange(id, e.target.value)}
                 className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5"
               >
                 {availableFormats.map(fmt => (
                   <option key={fmt.value} value={fmt.value}>{fmt.label}</option>
                 ))}
               </select>
             </div>
             
             <button 
               onClick={() => onConvert(id)}
               className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
             >
               <Play className="w-3 h-3 fill-current" /> Start
             </button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            {status === 'converting' && (
              <span className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                <Loader2 className="w-4 h-4 animate-spin" /> Converting...
              </span>
            )}
            {status === 'completed' && (
              <span className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <CheckCircle className="w-4 h-4" /> Done
              </span>
            )}
             {status === 'error' && (
              <span className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full" title={errorMessage}>
                <AlertCircle className="w-4 h-4" /> Error
              </span>
            )}
          </div>
        )}
      </div>

      <div className="w-30 flex justify-end">
        {status === 'completed' && url && (
          <a
            href={url}
            download={fileName}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" /> Download
          </a>
        )}
      </div>
    </div>
  );
}