import { useState } from 'react';
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  label: string;
  accept: string;
  maxSizeMB: number;
  onFileSelect: (file: File | null) => void;
  required?: boolean;
  helpText?: string;
}

export function FileUpload({ label, accept, maxSizeMB, onFileSelect, required = false, helpText }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): string | null => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSizeMB}MB`;
    }

    const acceptedTypes = accept.split(',').map(t => t.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const mimeType = file.type;

    const isValidType = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return fileExtension === type.toLowerCase();
      }
      return mimeType.match(new RegExp(type.replace('*', '.*')));
    });

    if (!isValidType) {
      return `Please upload a valid file type: ${accept}`;
    }

    return null;
  };

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setPreview(null);
      setError(null);
      onFileSelect(null);
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      setPreview(null);
      onFileSelect(null);
      return;
    }

    setError(null);
    setSelectedFile(file);
    onFileSelect(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      setPreview('pdf');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = () => {
    handleFileChange(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      {helpText && (
        <p className="text-sm text-gray-600 mb-2">{helpText}</p>
      )}

      {!selectedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            type="file"
            accept={accept}
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            className="hidden"
            id={`file-upload-${label.replace(/\s/g, '-')}`}
          />
          <label
            htmlFor={`file-upload-${label.replace(/\s/g, '-')}`}
            className="cursor-pointer"
          >
            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-700 mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              {accept.replace(/\./g, '').toUpperCase()} (Max {maxSizeMB}MB)
            </p>
          </label>
        </div>
      ) : (
        <div className="border-2 border-green-500 bg-green-50 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              {preview && preview !== 'pdf' ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded border border-gray-300"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded border border-gray-300 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {selectedFile.name}
                  </p>
                </div>
                <p className="text-xs text-gray-600">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0 ml-2"
              aria-label="Remove file"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded p-3">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
