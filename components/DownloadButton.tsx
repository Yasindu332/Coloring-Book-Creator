
import React from 'react';

declare const lucide: any;

interface DownloadButtonProps {
  onDownload: () => void;
  isDisabled: boolean;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ onDownload, isDisabled }) => {
  React.useEffect(() => {
    lucide.createIcons();
  }, []);
  
  return (
    <div className="mt-8 text-center">
      <button
        onClick={onDownload}
        disabled={isDisabled}
        className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-full text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 transition-transform transform hover:scale-105 duration-300 shadow-lg"
      >
        <i data-lucide="download" className="w-6 h-6 mr-3"></i>
        {isDisabled ? 'Waiting for pages...' : 'Download PDF'}
      </button>
    </div>
  );
};
