
import React from 'react';
import type { ColoringPage } from '../types';

interface ImagePreviewProps {
  images: ColoringPage[];
  isLoading: boolean;
  loadingMessage: string;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
        <svg className="animate-spin h-12 w-12 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

export const ImagePreview: React.FC<ImagePreviewProps> = ({ images, isLoading, loadingMessage }) => {
  if (isLoading && images.length === 0) {
    return (
        <div className="mt-8 text-center">
            <LoadingSpinner />
            <p className="mt-4 text-lg text-gray-600">{loadingMessage || "Warming up the magical crayons..."}</p>
        </div>
    );
  }

  if (!isLoading && images.length === 0) {
    return (
        <div className="mt-8 text-center bg-gray-50 rounded-lg p-10 border-2 border-dashed">
            <p className="text-gray-500">Your generated coloring pages will appear here!</p>
        </div>
    );
  }

  return (
    <div className="mt-8">
      {isLoading && images.length > 0 && (
         <div className="text-center mb-4 flex items-center justify-center gap-2">
            <LoadingSpinner/>
            <p className="text-lg text-gray-600">{loadingMessage}</p>
         </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={image.id} className="bg-white p-2 rounded-lg shadow-md border animate-fade-in">
            <img src={image.src} alt={`Coloring page ${index + 1}`} className="w-full h-auto object-cover rounded" />
            <p className="text-xs text-center text-gray-500 mt-2">Page {index + 1}</p>
          </div>
        ))}
        {/* Placeholder for loading images */}
        {isLoading && Array.from({length: 5 - images.length}).map((_, index) => (
            <div key={`placeholder-${index}`} className="bg-gray-100 p-2 rounded-lg shadow-md border flex items-center justify-center aspect-[4/3]">
                <LoadingSpinner />
            </div>
        ))}
      </div>
    </div>
  );
};
