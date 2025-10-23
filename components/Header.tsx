import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800/50 shadow-sm sticky top-0 z-10 backdrop-blur-md">
      <div className="container mx-auto max-w-7xl px-4 py-4 flex items-center gap-4">
        <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg">
           <SparklesIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            AI Progress Report Generator
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Synthesize student data into comprehensive reports.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
