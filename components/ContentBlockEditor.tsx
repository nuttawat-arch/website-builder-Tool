import React, { useState } from 'react';
import { BlockType, ContentBlock } from '../types';
import { suggestHeadingLevel, suggestImageAltText } from '../services/geminiService';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { ArrowDownIcon } from './icons/ArrowDownIcon';
import { TrashIcon } from './icons/TrashIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ImageIcon } from './icons/ImageIcon';

interface ContentBlockEditorProps {
  block: ContentBlock;
  onUpdate: (id: string, newContent: any) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
}

const BlockWrapper: React.FC<React.PropsWithChildren<ContentBlockEditorProps & { title: string }>> = ({ children, block, onDelete, onMove, isFirst, isLast, title }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 transition-shadow hover:shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <p className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">{title}</p>
        <div className="flex items-center space-x-1">
          <button aria-label="Move block up" onClick={() => onMove(block.id, 'up')} disabled={isFirst} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed">
            <ArrowUpIcon className="w-4 h-4 text-slate-500" />
          </button>
          <button aria-label="Move block down" onClick={() => onMove(block.id, 'down')} disabled={isLast} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed">
            <ArrowDownIcon className="w-4 h-4 text-slate-500" />
          </button>
          <button aria-label="Delete block" onClick={() => onDelete(block.id)} className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
            <TrashIcon className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
      {children}
    </div>
  );
};

export const ContentBlockEditor: React.FC<ContentBlockEditorProps> = (props) => {
  const { block, onUpdate } = props;
  const [isSuggestingLevel, setIsSuggestingLevel] = useState(false);
  const [isSuggestingAlt, setIsSuggestingAlt] = useState(false);

  const handleSuggestLevel = async (text: string) => {
    setIsSuggestingLevel(true);
    const level = await suggestHeadingLevel(text);
    onUpdate(block.id, { ...block.content, level });
    setIsSuggestingLevel(false);
  };

  const handleSuggestAltText = async (src: string) => {
    if (!src) return;
    setIsSuggestingAlt(true);
    const altText = await suggestImageAltText(src);
    onUpdate(block.id, { ...block.content, alt: altText });
    setIsSuggestingAlt(false);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate(block.id, { ...block.content, src: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  switch (block.type) {
    case BlockType.Heading:
      return (
        <BlockWrapper {...props} title="Heading">
          <div className="flex items-start space-x-2">
            <div className="flex-grow">
              <input
                type="text"
                value={block.content.text}
                onChange={(e) => onUpdate(block.id, { ...block.content, text: e.target.value })}
                placeholder="Your heading here..."
                aria-label="Heading text"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={block.content.level}
              onChange={(e) => onUpdate(block.id, { ...block.content, level: parseInt(e.target.value) as any })}
              aria-label="Heading level"
              className="px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>H{n}</option>)}
            </select>
            <button onClick={() => handleSuggestLevel(block.content.text)} disabled={isSuggestingLevel || !block.content.text} className="px-3 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-md flex items-center space-x-2 hover:bg-blue-200 dark:hover:bg-blue-900 disabled:opacity-50 disabled:cursor-wait">
               {isSuggestingLevel ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <SparklesIcon className="w-5 h-5"/>
              )}
              <span>Suggest</span>
            </button>
          </div>
        </BlockWrapper>
      );
    case BlockType.Paragraph:
      return (
        <BlockWrapper {...props} title="Paragraph">
          <textarea
            value={block.content.text}
            onChange={(e) => onUpdate(block.id, { text: e.target.value })}
            placeholder="Write your paragraph content..."
            aria-label="Paragraph text"
            rows={5}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </BlockWrapper>
      );
    case BlockType.Link:
      return (
        <BlockWrapper {...props} title="Link">
          <div className="space-y-3">
            <div>
              <label htmlFor={`link-text-${block.id}`} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Display Text
              </label>
              <input
                id={`link-text-${block.id}`}
                type="text"
                value={block.content.text}
                onChange={(e) => onUpdate(block.id, { ...block.content, text: e.target.value })}
                placeholder="e.g., Go to this song"
                aria-label="Link display text"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor={`link-href-${block.id}`} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                URL (Link Address)
              </label>
              <input
                id={`link-href-${block.id}`}
                type="url"
                value={block.content.href}
                onChange={(e) => onUpdate(block.id, { ...block.content, href: e.target.value })}
                placeholder="e.g., https://www.example.com/song"
                aria-label="Link URL"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </BlockWrapper>
      );
    case BlockType.Image:
      return (
         <BlockWrapper {...props} title="Image">
          <div className="space-y-4">
            {block.content.src && (
              <img src={block.content.src} alt={block.content.alt || 'Preview'} className="max-h-48 w-auto rounded-md border border-slate-200 dark:border-slate-700"/>
            )}
            
            {!block.content.src && (
              <div className="w-full h-32 bg-slate-100 dark:bg-slate-700 rounded-md flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600">
                <ImageIcon className="w-10 h-10 text-slate-400 dark:text-slate-500 mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">Upload an image to get started</p>
              </div>
            )}

            <div>
              <label htmlFor={`image-upload-${block.id}`} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Image File
              </label>
              <input
                id={`image-upload-${block.id}`}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                aria-label="Upload image"
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>

            <div className="w-full">
                <label htmlFor={`image-alt-${block.id}`} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Alt Text (for accessibility)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    id={`image-alt-${block.id}`}
                    type="text"
                    value={block.content.alt}
                    onChange={(e) => onUpdate(block.id, { ...block.content, alt: e.target.value })}
                    placeholder="A descriptive summary of the image"
                    aria-label="Image description (alt text)"
                    className="flex-grow w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button onClick={() => handleSuggestAltText(block.content.src)} disabled={isSuggestingAlt || !block.content.src} className="px-3 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-md flex items-center space-x-2 hover:bg-blue-200 dark:hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0">
                    {isSuggestingAlt ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <SparklesIcon className="w-5 h-5"/>
                    )}
                    <span className="hidden sm:inline">Suggest</span>
                  </button>
                </div>
            </div>
          </div>
        </BlockWrapper>
      );
    case BlockType.Embed:
      return (
        <BlockWrapper {...props} title="Embed HTML">
          <textarea
            value={block.content.code}
            onChange={(e) => onUpdate(block.id, { code: e.target.value })}
            placeholder='Paste your embed code here (e.g., from YouTube, Google Maps, or an iframe)'
            aria-label="Embed HTML code"
            rows={5}
            className="w-full font-mono text-sm px-3 py-2 bg-slate-900 text-slate-200 border border-slate-700 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </BlockWrapper>
      );
    case BlockType.HorizontalRule:
       return (
        <BlockWrapper {...props} title="Separator Line">
          <div className="py-2">
            <hr className="border-slate-300 dark:border-slate-600" />
          </div>
        </BlockWrapper>
      );
    default:
      return null;
  }
};