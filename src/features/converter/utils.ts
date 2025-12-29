// Define the available output formats
export const FORMATS = {
  video: [
    { value: 'mp4', label: 'MP4 (H.264)' },
    { value: 'webm', label: 'WebM (VP9)' },
    { value: 'avi', label: 'AVI' },
    { value: 'mov', label: 'MOV (QuickTime)' },
    { value: 'mkv', label: 'MKV' },
  ],
  audio: [
    { value: 'mp3', label: 'MP3' },
    { value: 'wav', label: 'WAV' },
    { value: 'aac', label: 'AAC' },
    { value: 'ogg', label: 'OGG' },
  ],
  image: [
    { value: 'jpg', label: 'JPEG' },
    { value: 'png', label: 'PNG' },
    { value: 'webp', label: 'WebP' },
    { value: 'gif', label: 'GIF' },
  ]
};

export type FileType = 'video' | 'audio' | 'image' | 'unknown';

export function detectFileType(file: File): FileType {
  if (file.type.startsWith('video/')) return 'video';
  if (file.type.startsWith('audio/')) return 'audio';
  if (file.type.startsWith('image/')) return 'image';
  
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (['mp4', 'mkv', 'avi', 'mov'].includes(extension || '')) return 'video';
  if (['mp3', 'wav', 'ogg'].includes(extension || '')) return 'audio';
  if (['jpg', 'jpeg', 'png', 'webp'].includes(extension || '')) return 'image';

  return 'unknown';
}

export function getAvailableFormats(fileType: FileType) {
  return FORMATS[fileType as keyof typeof FORMATS] || [];
}