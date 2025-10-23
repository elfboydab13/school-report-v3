const MOCK_IXL_DATA: { [key: string]: string } = {
  '101': `
    Subject: Math
    Time Spent: 2h 15m
    Skills Mastered: 8
    Diagnostic Strand: Algebra - Score 680 (Working at Grade Level)
    Teacher Recommendation: Focus on "Solving quadratic equations".
  `,
  '102': `
    Subject: English Language Arts
    Time Spent: 3h 5m
    Skills Mastered: 12
    Diagnostic Strand: Reading Comprehension - Score 750 (Above Grade Level)
    Teacher Recommendation: Explore "Analyzing informational texts".
  `,
  '103': `
    Subject: Math
    Time Spent: 45m
    Skills Mastered: 2
    Diagnostic Strand: Geometry - Score 510 (Needs Improvement)
    Teacher Recommendation: Practice "Understanding angles and lines".
  `,
  '104': `
    Subject: Science
    Time Spent: 1h 30m
    Skills Mastered: 6
    Diagnostic Strand: Life Science - Score 710 (Proficient)
    Teacher Recommendation: Challenge with "Ecosystem dynamics".
  `,
};

// Mocks a network request
const mockRequest = <T,>(data: T, delay = 1000): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(data), delay));
};

// Mock function to simulate connecting to IXL API
export const connectToIXL = async (username: string, secret: string): Promise<boolean> => {
    console.log('Connecting to IXL with:', { username });
    if (username && secret) {
        return mockRequest(true, 800);
    }
    return mockRequest(false, 200);
};

// Mock function to get detailed IXL data for a single student
export const getStudentIXLData = async (studentId: string): Promise<string> => {
    const data = MOCK_IXL_DATA[studentId] || 'No IXL data found for this student.';
    return mockRequest(data, 600);
};
