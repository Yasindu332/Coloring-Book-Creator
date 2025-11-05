
import React from 'react';

interface ColoringBookFormProps {
  theme: string;
  setTheme: (theme: string) => void;
  childName: string;
  setChildName: (name: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const ColoringBookForm: React.FC<ColoringBookFormProps> = ({
  theme,
  setTheme,
  childName,
  setChildName,
  onGenerate,
  isLoading,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-0 md:flex md:space-x-4 md:items-end">
      <div className="flex-1">
        <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">Theme (e.g., "Jungle Animals")</label>
        <input
          id="theme"
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="Space Dinosaurs"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition"
          required
        />
      </div>
      <div className="flex-1">
        <label htmlFor="childName" className="block text-sm font-medium text-gray-700 mb-1">Child's Name</label>
        <input
          id="childName"
          type="text"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          placeholder="Leo"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full md:w-auto flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-lg text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300 disabled:cursor-not-allowed transition duration-300"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating...
          </>
        ) : (
          'Generate!'
        )}
      </button>
    </form>
  );
};
