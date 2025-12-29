import { useConverter } from '../useConverter';
import { DropZone } from './DropZone';
import { FileRow } from './FileRow';

export function ConverterDashboard() {
  const { files, addFile, updateOutputFormat, startConversion } = useConverter();

  const handleFilesDropped = (droppedFiles: File[]) => {
    droppedFiles.forEach((file) => {
      addFile(file);
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Media Forge</h1>
        <p className="text-slate-500">
          Professional client-side conversion. Video, Audio, & Images.
        </p>
      </div>

      <DropZone onFilesDropped={handleFilesDropped} />

      <div className="space-y-4">
        {files.length > 0 && <h2 className="text-lg font-semibold text-slate-700">Conversion Queue</h2>}
        
        {files.map((file) => (
          <FileRow 
            key={file.id} 
            fileData={file} 
            onFormatChange={updateOutputFormat}
            onConvert={startConversion}
          />
        ))}
      </div>
    </div>
  );
}