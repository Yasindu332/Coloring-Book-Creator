
import React, { useState, useCallback } from 'react';
import { generateColoringPages } from './services/geminiService';
import { generatePdf } from './utils/pdfGenerator';
import type { ColoringPage } from './types';
import { Header } from './components/Header';
import { ColoringBookForm } from './components/ColoringBookForm';
import { ImagePreview } from './components/ImagePreview';
import { DownloadButton } from './components/DownloadButton';
import ChatBot from './components/ChatBot';

const App: React.FC = () => {
  const [theme, setTheme] = useState<string>('');
  const [childName, setChildName] = useState<string>('');
  const [generatedImages, setGeneratedImages] = useState<ColoringPage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!theme || !childName) {
      setError('Please enter both a theme and a name.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setGeneratedImages([]);

    try {
      const pagePrompts = [
        `A friendly character related to ${theme} waving hello.`,
        `A cute animal from ${theme} playing with a toy.`,
        `A beautiful scene or landscape from ${theme}.`,
        `A funny situation involving multiple characters from ${theme}.`,
        `A character from ${theme} sleeping peacefully under the stars.`
      ];

      const imageResults: ColoringPage[] = [];

      for (let i = 0; i < pagePrompts.length; i++) {
        setLoadingMessage(`Generating page ${i + 1} of 5...`);
        const result = await generateColoringPages(pagePrompts[i]);
        if (result.length > 0) {
            imageResults.push({ id: `page-${i + 1}`, src: result[0], prompt: pagePrompts[i] });
            setGeneratedImages([...imageResults]);
        }
      }
      setLoadingMessage('All pages generated!');
    } catch (err) {
      console.error(err);
      setError('Sorry, something went wrong while creating the images. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [theme, childName]);

  const handleDownload = useCallback(async () => {
    if (generatedImages.length < 5) {
        setError('Please wait until all 5 images are generated.');
        return;
    }
    await generatePdf(generatedImages.map(img => img.src), childName, theme);
  }, [generatedImages, childName, theme]);

  return (
    <div className="min-h-screen bg-amber-50 text-gray-800 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mt-6">
          <p className="text-center text-gray-600 mb-6">
            Welcome! Let's create a magical coloring book for your little one. Just enter a theme and their name below.
          </p>
          <ColoringBookForm
            theme={theme}
            setTheme={setTheme}
            childName={childName}
            setChildName={setChildName}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          
          <ImagePreview
            images={generatedImages}
            isLoading={isLoading}
            loadingMessage={loadingMessage}
          />

          <DownloadButton
            onDownload={handleDownload}
            isDisabled={isLoading || generatedImages.length < 5}
          />
        </main>
      </div>
      <ChatBot />
    </div>
  );
};

export default App;
