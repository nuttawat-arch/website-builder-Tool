import React, { useState, useCallback } from 'react';
import { ContentBlock, BlockType } from './types';
import { ContentBlockEditor } from './components/ContentBlockEditor';
import { PreviewModal } from './components/PreviewModal';
import { PlusIcon } from './components/icons/PlusIcon';

const App: React.FC = () => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [websiteTitle, setWebsiteTitle] = useState('My Generated Website');
  const [showPreview, setShowPreview] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [showAddMenu, setShowAddMenu] = useState(false);

  const addBlock = (type: BlockType) => {
    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      type,
      content: getDefaultContent(type),
    } as ContentBlock;
    setBlocks([...blocks, newBlock]);
    setShowAddMenu(false);
  };

  const getDefaultContent = (type: BlockType) => {
    switch (type) {
      case BlockType.Heading:
        return { text: '', level: 1 };
      case BlockType.Paragraph:
        return { text: '' };
      case BlockType.Link:
        return { text: '', href: '' };
      case BlockType.Image:
        return { src: '', alt: '' };
      case BlockType.Embed:
        return { code: '' };
      case BlockType.HorizontalRule:
        return {};
      default:
        return {};
    }
  };

  const updateBlock = (id: string, newContent: any) => {
    setBlocks(blocks.map(block => block.id === id ? { ...block, content: newContent } : block));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(block => block.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  const generateHtmlContent = useCallback(() => {
    const bodyContent = blocks.map(block => {
      switch (block.type) {
        case BlockType.Heading:
          return `<h${block.content.level}>${block.content.text}</h${block.content.level}>`;
        case BlockType.Paragraph:
          return `<p>${block.content.text.replace(/\n/g, '<br>')}</p>`;
        case BlockType.Link: {
          const text = block.content.text || block.content.href;
          if (!text) return ''; // Don't render if both are empty
          return `<p><a href="${block.content.href || '#'}" target="_blank" rel="noopener noreferrer">${text}</a></p>`;
        }
        case BlockType.Image:
          return `<img src="${block.content.src}" alt="${block.content.alt}" style="max-width: 100%; height: auto; margin: 1rem 0;">`;
        case BlockType.Embed:
          return `<div class="embed-container">${block.content.code}</div>`;
        case BlockType.HorizontalRule:
          return `<hr>`;
        default:
          return '';
      }
    }).join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${websiteTitle}</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      max-width: 800px; 
      margin: 2rem auto; 
      padding: 0 1rem; 
      background-color: #f9fafb;
    }
    h1, h2, h3, h4, h5, h6 { color: #111; }
    a { color: #007bff; text-decoration: none; }
    a:hover { text-decoration: underline; }
    img { border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    hr { border: 0; height: 1px; background: #ddd; margin: 2rem 0; }
    .embed-container {
      position: relative;
      overflow: hidden;
      max-width: 100%;
      padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
      height: 0;
      margin: 1rem 0;
    }
    .embed-container iframe,
    .embed-container object,
    .embed-container embed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
${bodyContent}
</body>
</html>`;
  }, [blocks, websiteTitle]);


  const handleGenerateClick = () => {
    setGeneratedHtml(generateHtmlContent());
    setShowPreview(true);
  };
  
  const addMenuOptions = [
    { label: "Heading", type: BlockType.Heading },
    { label: "Paragraph", type: BlockType.Paragraph },
    { label: "Link", type: BlockType.Link },
    { label: "Image", type: BlockType.Image },
    { label: "Embed HTML", type: BlockType.Embed },
    { label: "Separator Line", type: BlockType.HorizontalRule },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <header className="bg-white dark:bg-slate-800/50 backdrop-blur-sm shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Website Builder Tool
          </h1>
          <button
            onClick={handleGenerateClick}
            disabled={blocks.length === 0 && !websiteTitle.trim()}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            Generate Website
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-4">
           <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
            <label htmlFor="website-title" className="block text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 mb-2">
              Website Title
            </label>
            <input
              id="website-title"
              type="text"
              value={websiteTitle}
              onChange={(e) => setWebsiteTitle(e.target.value)}
              placeholder="My Awesome Website"
              aria-label="Website Title"
              className="w-full text-xl font-semibold bg-transparent border-0 p-0 focus:ring-0 focus:outline-none text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
          {blocks.map((block, index) => (
            <ContentBlockEditor
              key={block.id}
              block={block}
              onUpdate={updateBlock}
              onDelete={deleteBlock}
              onMove={moveBlock}
              isFirst={index === 0}
              isLast={index === blocks.length - 1}
            />
          ))}
           {blocks.length === 0 && (
            <div className="text-center py-16 px-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
              <h2 className="text-xl font-semibold text-slate-500">Your page is empty!</h2>
              <p className="text-slate-400 mt-2">Click the '+' button below to start adding content.</p>
            </div>
          )}
        </div>
      </main>
      
      <div className="fixed bottom-8 right-8 z-30">
        <div className="relative">
          {showAddMenu && (
            <div role="menu" aria-orientation="vertical" aria-labelledby="add-menu-button" className="absolute bottom-16 right-0 w-48 bg-white dark:bg-slate-700 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-600 overflow-hidden mb-2">
              {addMenuOptions.map(opt => (
                <button
                  role="menuitem"
                  key={opt.type}
                  onClick={() => addBlock(opt.type)}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-600"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
          <button
            id="add-menu-button"
            aria-haspopup="true"
            aria-expanded={showAddMenu}
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-transform transform hover:scale-105"
            aria-label="Add content block"
          >
            <PlusIcon className="w-8 h-8"/>
          </button>
        </div>
      </div>


      {showPreview && (
        <PreviewModal htmlContent={generatedHtml} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
};

export default App;