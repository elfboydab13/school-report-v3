import React, { useState, useCallback } from 'react';
import type { StudentData } from './types';
import { generateReport } from './services/geminiService';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ReportSection from './components/ReportSection';

const App: React.FC = () => {
  const [studentData, setStudentData] = useState<StudentData>({
    studentName: '',
    powerschoolData: '',
    ixlData: '',
    behaviorData: '',
    focusArea: '',
  });
  const [progressReport, setProgressReport] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = useCallback(async () => {
    if (!studentData.studentName) {
      setError('Please enter a student name.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgressReport('');

    try {
      const report = await generateReport(studentData);
      setProgressReport(report);
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating the report. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [studentData]);

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200">
      <Header />
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
          <InputSection
            studentData={studentData}
            setStudentData={setStudentData}
            onGenerate={handleGenerateReport}
            isLoading={isLoading}
            error={error}
          />
          <ReportSection
            report={progressReport}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
