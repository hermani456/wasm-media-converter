import { useConverter } from "../useConverter";
import { DropZone } from "./DropZone";
import { FileRow } from "./FileRow";

export function ConverterDashboard() {
  const { files, addFile, updateOutputFormat, startConversion, removeFile } =
    useConverter();

  const handleFilesDropped = (droppedFiles: File[]) => {
    droppedFiles.forEach((file) => {
      addFile(file);
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Media Forge
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Transform your media files locally using WebAssembly. No server
          uploads and no data limits. Your files stay 100% private because they
          never leave your device.
        </p>
      </div>

      <DropZone onFilesDropped={handleFilesDropped} />

      <div className="space-y-4">
        {files.length > 0 && (
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
            Conversion Queue
          </h2>
        )}

        {files.map((file) => (
          <FileRow
            key={file.id}
            fileData={file}
            onFormatChange={updateOutputFormat}
            onConvert={startConversion}
            onRemove={removeFile}
          />
        ))}
      </div>
    </div>
  );
}
