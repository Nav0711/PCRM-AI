import { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { FileAttachment } from '@/types';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  files: FileAttachment[];
  onChange: (files: FileAttachment[]) => void;
  accept?: string;
  className?: string;
}

export function FileUpload({ files, onChange, accept = 'image/*,.pdf', className }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((fileList: FileList) => {
    const newFiles: FileAttachment[] = Array.from(fileList).map(f => ({
      id: crypto.randomUUID(),
      name: f.name,
      type: f.type,
      size: f.size,
      previewUrl: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
    }));
    onChange([...files, ...newFiles]);
  }, [files, onChange]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    onChange(files.filter(f => f.id !== id));
  };

  return (
    <div className={className}>
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors',
          dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
        )}
      >
        <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Click or drag files to upload</p>
        <p className="text-xs text-muted-foreground mt-1">Images & PDFs accepted</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          className="hidden"
          onChange={e => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {files.map(file => (
            <div key={file.id} className="relative group rounded-md border bg-card overflow-hidden">
              {file.previewUrl ? (
                <img src={file.previewUrl} alt={file.name} className="h-24 w-full object-cover" />
              ) : (
                <div className="h-24 flex items-center justify-center bg-muted">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="p-1.5">
                <p className="text-xs truncate">{file.name}</p>
              </div>
              <button
                onClick={e => { e.stopPropagation(); removeFile(file.id); }}
                className="absolute top-1 right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
