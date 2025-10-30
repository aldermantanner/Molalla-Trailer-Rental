import { X, ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react';
import { useState } from 'react';

interface DocumentViewerProps {
  imageUrl: string;
  title: string;
  onClose: () => void;
}

export function DocumentViewer({ imageUrl, title, onClose }: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = title;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="relative w-full h-full max-w-6xl">
        <div className="absolute top-4 left-0 right-0 flex justify-between items-center px-4 z-10">
          <h3 className="text-white text-xl font-bold">{title}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <span className="text-white font-semibold">{zoom}%</span>
            <button
              onClick={handleZoomIn}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button
              onClick={handleRotate}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition-colors"
              title="Rotate"
            >
              <RotateCw className="h-5 w-5" />
            </button>
            <button
              onClick={handleDownload}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="w-full h-full flex items-center justify-center overflow-auto">
          <img
            src={imageUrl}
            alt={title}
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease',
            }}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        <div className="absolute bottom-4 left-0 right-0 text-center">
          <p className="text-white text-sm opacity-75">
            Use mouse wheel to zoom, click and drag to pan
          </p>
        </div>
      </div>
    </div>
  );
}
