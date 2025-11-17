
import React, { useState } from 'react';

interface PreviewModalProps {
  htmlContent: string;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ htmlContent, onClose }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copyButtonText, setCopyButtonText] = useState('Copy HTML');
  
  const handleCopy = () => {
    navigator.clipboard.writeText(htmlContent).then(() => {
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy HTML'), 2000);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
        <header className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <div role="tablist" aria-label="Preview mode" className="flex border border-slate-200 dark:border-slate-600 rounded-lg p-1">
            <button
              role="tab"
              id="preview-tab"
              aria-selected={activeTab === 'preview'}
              aria-controls="preview-panel"
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-1 text-sm font-medium rounded-md ${activeTab === 'preview' ? 'bg-blue-500 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
              Preview
            </button>
            <button
              role="tab"
              id="code-tab"
              aria-selected={activeTab === 'code'}
              aria-controls="code-panel"
              onClick={() => setActiveTab('code')}
              className={`px-4 py-1 text-sm font-medium rounded-md ${activeTab === 'code' ? 'bg-blue-500 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
              HTML Code
            </button>
          </div>
          <div className="flex items-center space-x-4">
             <button onClick={handleCopy} className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg text-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-75">
                {copyButtonText}
            </button>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </header>
        <main className="flex-grow overflow-auto">
          {activeTab === 'preview' ? (
            <iframe
              role="tabpanel"
              id="preview-panel"
              aria-labelledby="preview-tab"
              srcDoc={htmlContent}
              title="Website Preview"
              className="w-full h-full border-0"
            />
          ) : (
            <pre role="tabpanel" id="code-panel" aria-labelledby="code-tab" className="w-full h-full p-4 text-sm bg-slate-900 text-slate-100 overflow-auto">
              <code>{htmlContent}</code>
            </pre>
          )}
        </main>
      </div>
    </div>
  );
};
