import React, { useState } from 'react';
import type { StudentData, Student } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { LinkIcon } from './icons/LinkIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import * as PowerSchoolAPI from '../services/powerschoolService';
import * as IxlAPI from '../services/ixlService';
import * as BehaviorAPI from '../services/behaviorService';


interface InputSectionProps {
  studentData: StudentData;
  setStudentData: React.Dispatch<React.SetStateAction<StudentData>>;
  onGenerate: () => void;
  isLoading: boolean;
  error: string | null;
}

const CredentialInput: React.FC<{ id: string, label: string, type?: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ id, label, type = 'text', value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {label}
        </label>
        <input
            type={type}
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            className="block w-full text-sm rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-150 ease-in-out"
        />
    </div>
);

const DataPreview: React.FC<{ title: string; data: string; }> = ({ title, data }) => (
    <div className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-md">
        <h4 className="text-sm font-semibold mb-2 text-slate-800 dark:text-slate-200">{title}</h4>
        <pre className="text-xs whitespace-pre-wrap font-mono bg-transparent text-slate-600 dark:text-slate-400 max-h-24 overflow-y-auto">{data}</pre>
    </div>
);


const InputSection: React.FC<InputSectionProps> = ({ studentData, setStudentData, onGenerate, isLoading, error }) => {
  
  // PowerSchool State
  const [psCredentials, setPsCredentials] = useState({ url: 'https://myschool.powerschool.com', clientId: 'test-client-id', clientSecret: 'test-client-secret' });
  const [isPsConnected, setIsPsConnected] = useState(false);
  const [isPsLoading, setIsPsLoading] = useState(false);
  const [psError, setPsError] = useState<string | null>(null);
  
  // IXL State
  const [ixlCredentials, setIxlCredentials] = useState({ username: 'teacher@school.edu', secret: 'password123' });
  const [isIxlConnected, setIsIxlConnected] = useState(false);
  const [isIxlLoading, setIsIxlLoading] = useState(false);
  const [ixlError, setIxlError] = useState<string | null>(null);

  // Behavior State
  const [isBehaviorConnected, setIsBehaviorConnected] = useState(false);
  const [isBehaviorLoading, setIsBehaviorLoading] = useState(false);
  const [behaviorError, setBehaviorError] = useState<string | null>(null);

  // Shared State
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [isDataFetching, setIsDataFetching] = useState(false);


  const handleDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStudentData(prev => ({ ...prev, [name]: value }));
  };

  const handleCredentialChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setter(prev => ({...prev, [name]: value}));
  };

  const handleConnectPowerSchool = async () => {
    setIsPsLoading(true);
    setPsError(null);
    try {
        const success = await PowerSchoolAPI.connectToPowerSchool(psCredentials.url, psCredentials.clientId, psCredentials.clientSecret);
        if (success) {
            const studentList = await PowerSchoolAPI.getStudents();
            setStudents(studentList);
            setIsPsConnected(true);
        } else {
            setPsError('Connection failed. Please check credentials.');
        }
    } catch (err) {
        setPsError('An error occurred during connection.');
    } finally {
        setIsPsLoading(false);
    }
  };
  
  const handleConnectIXL = async () => {
    setIsIxlLoading(true);
    setIxlError(null);
    try {
        const success = await IxlAPI.connectToIXL(ixlCredentials.username, ixlCredentials.secret);
        if (success) {
            setIsIxlConnected(true);
        } else {
            setIxlError('Connection failed. Please check credentials.');
        }
    } catch (err) {
        setIxlError('An error occurred during connection.');
    } finally {
        setIsIxlLoading(false);
    }
  };

  const handleConnectBehavior = async () => {
    setIsBehaviorLoading(true);
    setBehaviorError(null);
    try {
        const success = await BehaviorAPI.connectToBehaviorSystem();
        if (success) {
            setIsBehaviorConnected(true);
        } else {
            setBehaviorError('Connection failed.');
        }
    } catch (err) {
        setBehaviorError('An error occurred during connection.');
    } finally {
        setIsBehaviorLoading(false);
    }
  };

  const handleSelectStudent = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const studentId = e.target.value;
    setSelectedStudentId(studentId);
    
    // Reset data on selection change
    setStudentData(prev => ({ ...prev, studentName: '', powerschoolData: '', ixlData: '', behaviorData: '' }));

    if (!studentId) return;
    
    setIsDataFetching(true);
    const student = students.find(s => s.id === studentId);
    
    const dataPromises = [PowerSchoolAPI.getStudentData(studentId)];
    if (isIxlConnected) dataPromises.push(IxlAPI.getStudentIXLData(studentId));
    if (isBehaviorConnected) dataPromises.push(BehaviorAPI.getStudentBehaviorData(studentId));
    
    try {
        const [psData, ixlData, behaviorData] = await Promise.all(dataPromises);
        
        setStudentData(prev => ({
            ...prev,
            studentName: student ? student.name : '',
            powerschoolData: psData || '',
            ixlData: isIxlConnected ? (ixlData || '') : '',
            behaviorData: isBehaviorConnected ? (behaviorData || '') : '',
        }));
    } catch (err) {
        console.error("Failed to fetch student data bundle:", err);
        // You might want to set a general error state here
    } finally {
        setIsDataFetching(false);
    }
  };

  const getButtonContent = (isLoading: boolean, text: string) => (
    <>
      {isLoading && <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
      {text}
    </>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Data Sources</h2>
          
          {/* PowerSchool Section */}
          <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-md">
            <div className="flex items-center gap-3 mb-2">
                <LinkIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">PowerSchool</h3>
                {isPsConnected && <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-0.5 rounded-full">Connected</span>}
            </div>
             {!isPsConnected ? (
                <div className="space-y-3">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Connect to fetch student roster and academic data. This is a simulation.</p>
                    <CredentialInput id="url" label="Server URL" value={psCredentials.url} onChange={handleCredentialChange(setPsCredentials)} />
                    <CredentialInput id="clientId" label="Client ID" value={psCredentials.clientId} onChange={handleCredentialChange(setPsCredentials)} />
                    <CredentialInput id="clientSecret" label="Client Secret" type="password" value={psCredentials.clientSecret} onChange={handleCredentialChange(setPsCredentials)} />
                    {psError && <p className="text-sm text-red-500">{psError}</p>}
                    <button onClick={handleConnectPowerSchool} disabled={isPsLoading} className="w-full flex justify-center items-center gap-2 rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 disabled:opacity-50">
                      {getButtonContent(isPsLoading, 'Connect')}
                    </button>
                </div>
            ) : <p className="text-sm text-slate-500 dark:text-slate-400">PowerSchool connected. You can now select a student below.</p>}
          </div>

          {/* IXL Section */}
          <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-md">
             <div className="flex items-center gap-3 mb-2">
                <ChartBarIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">IXL</h3>
                 {isIxlConnected && <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-0.5 rounded-full">Connected</span>}
            </div>
             {!isIxlConnected ? (
                <div className="space-y-3">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Connect to pull skill development and diagnostic data.</p>
                    <CredentialInput id="username" label="Username" value={ixlCredentials.username} onChange={handleCredentialChange(setIxlCredentials)} />
                    <CredentialInput id="secret" label="Password" type="password" value={ixlCredentials.secret} onChange={handleCredentialChange(setIxlCredentials)} />
                    {ixlError && <p className="text-sm text-red-500">{ixlError}</p>}
                    <button onClick={handleConnectIXL} disabled={isIxlLoading} className="w-full flex justify-center items-center gap-2 rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 disabled:opacity-50">
                      {getButtonContent(isIxlLoading, 'Connect')}
                    </button>
                </div>
            ) : <p className="text-sm text-slate-500 dark:text-slate-400">IXL connected.</p>}
          </div>

           {/* Behavioral Notes Section */}
          <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-md">
             <div className="flex items-center gap-3 mb-2">
                <UserCircleIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">Behavioral Notes</h3>
                 {isBehaviorConnected && <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-0.5 rounded-full">Connected</span>}
            </div>
             {!isBehaviorConnected ? (
                <div className="space-y-3">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Connect to your internal system for behavioral observations.</p>
                    <button onClick={handleConnectBehavior} disabled={isBehaviorLoading} className="w-full flex justify-center items-center gap-2 rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 disabled:opacity-50">
                       {getButtonContent(isBehaviorLoading, 'Connect')}
                    </button>
                    {behaviorError && <p className="text-sm text-red-500 mt-2">{behaviorError}</p>}
                </div>
            ) : <p className="text-sm text-slate-500 dark:text-slate-400">Behavioral system connected.</p>}
          </div>
      </div>
      
      {isPsConnected && (
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Select Student & Review Data</h2>
            <div>
              <label htmlFor="student-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Student
              </label>
              <select id="student-select" value={selectedStudentId} onChange={handleSelectStudent} className="block w-full text-sm rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                  <option value="">-- Choose a student --</option>
                  {students.map(student => (
                      <option key={student.id} value={student.id}>{student.name}</option>
                  ))}
              </select>
            </div>
            {isDataFetching && <p className="text-sm text-slate-500 dark:text-slate-400">Fetching data...</p>}
            {!isDataFetching && studentData.studentName && (
              <div className="space-y-3 pt-2">
                {studentData.powerschoolData && <DataPreview title="PowerSchool Data" data={studentData.powerschoolData} />}
                {studentData.ixlData && <DataPreview title="IXL Data" data={studentData.ixlData} />}
                {studentData.behaviorData && <DataPreview title="Behavioral Notes" data={studentData.behaviorData} />}
              </div>
            )}
        </div>
      )}

       <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Additional Information</h2>
        <div>
            <label htmlFor="focusArea" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Key Focus Area (Optional)
            </label>
            <textarea
                id="focusArea"
                name="focusArea"
                placeholder="Mention any specific concerns or areas you want the report to emphasize."
                value={studentData.focusArea}
                onChange={handleDataChange}
                rows={3}
                className="block w-full text-sm rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-150 ease-in-out"
            />
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-r-md" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <button
        onClick={onGenerate}
        disabled={isLoading || !studentData.studentName}
        className="w-full flex justify-center items-center gap-2 rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <SparklesIcon className="w-5 h-5" />
            Generate Report
          </>
        )}
      </button>
    </div>
  );
};

export default InputSection;
