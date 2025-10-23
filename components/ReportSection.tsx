import React, { useState, useEffect } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';

interface ReportSectionProps {
  report: string;
  isLoading: boolean;
}

const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
    <div className="space-y-2">
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
    </div>
    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mt-4"></div>
     <div className="space-y-2">
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-4/6"></div>
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
    </div>
  </div>
);

// A simple markdown to HTML converter.
// NOTE: In a real production app, a library like 'marked' or 'react-markdown' would be safer and more robust.
// This is a simplified version for demonstration purposes.
const SimpleMarkdown: React.FC<{ content: string }> = ({ content }) => {
    const htmlContent = content
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-2 text-slate-900 dark:text-white">$1</h3>')
        .replace(/^#### (.*$)/gim, '<h4 class="text-base font-semibold mt-4 mb-2 text-indigo-600 dark:text-indigo-400">$1</h4>')
        .replace(/^\* (.*$)/gim, '<li class="ml-5 list-disc">$1</li>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .split('\n').map(line => line.trim() ? `<p>${line}</p>` : '<br/>').join('')
        .replace(/<p><h[34]>/g, '<h').replace(/<\/h[34]><\/p>/g, '</h>')
        .replace(/<p><li>/g, '<li>').replace(/<\/li><\/p>/g, '</li>')
        .replace(/(<br\/>\s*){2,}/g, '<br/>')


    return <div className="prose prose-slate dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};


const ReportSection: React.FC<ReportSectionProps> = ({ report, isLoading }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(report);
    setCopied(true);
  };

  return (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-sm lg:sticky lg:top-24 h-full min-h-[60vh] lg:min-h-0 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Generated Report</h2>
        {report && !isLoading && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          >
            <ClipboardIcon className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>
      <div className="flex-grow overflow-y-auto pr-2 -mr-2">
        {isLoading && <LoadingSkeleton />}
        {!isLoading && !report && (
          <div className="text-center text-slate-500 dark:text-slate-400 h-full flex flex-col justify-center items-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="font-medium">Your generated report will appear here.</p>
            <p className="text-sm">Fill in the student data and click "Generate Report" to start.</p>
          </div>
        )}
        {report && !isLoading && (
          <div className="whitespace-pre-wrap font-serif text-slate-700 dark:text-slate-300 leading-relaxed report-content">
             <SimpleMarkdown content={report} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportSection;
