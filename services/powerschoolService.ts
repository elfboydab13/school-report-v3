import type { Student } from '../types';

// Mock data
const MOCK_STUDENTS: Student[] = [
  { id: '101', name: 'John Doe' },
  { id: '102', name: 'Jane Smith' },
  { id: '103', name: 'Peter Jones' },
  { id: '104', name: 'Mary Williams' },
];

const MOCK_STUDENT_DATA: { [key: string]: string } = {
  '101': `
    Subject: Math
    Grade: B+ (88%)
    Teacher Comments: John consistently participates in class discussions. Struggles with complex algebraic concepts but shows improvement.
    ---
    Subject: English Language Arts
    Grade: A- (92%)
    Teacher Comments: Excellent reading comprehension. Needs to work on providing more detailed evidence in analytical essays.
    ---
    Attendance:
    Absences: 2 (excused)
    Tardies: 1
  `,
  '102': `
    Subject: Math
    Grade: A (95%)
    Teacher Comments: Jane has a strong grasp of all mathematical concepts and often helps her peers.
    ---
    Subject: English Language Arts
    Grade: A (96%)
    Teacher Comments: A talented writer with a creative voice. Consistently submits high-quality work.
    ---
    Attendance:
    Absences: 0
    Tardies: 0
  `,
  '103': `
    Subject: Science
    Grade: C (75%)
    Teacher Comments: Peter shows curiosity but needs to improve his study habits for tests. Lab work is satisfactory.
    ---
    Subject: Social Studies
    Grade: B (85%)
    Teacher Comments: Engages well with historical topics. Written assignments are well-researched.
    ---
    Attendance:
    Absences: 4 (3 unexcused)
    Tardies: 3
  `,
   '104': `
    Subject: Art
    Grade: A+ (99%)
    Teacher Comments: Mary is an exceptionally talented artist with a unique vision. A leader in the classroom.
    ---
    Subject: Physical Education
    Grade: B- (81%)
    Teacher Comments: Participates enthusiastically. Can work on teamwork skills during group sports.
    ---
    Attendance:
    Absences: 1 (excused)
    Tardies: 0
  `,
};


// Mocks a network request
const mockRequest = <T,>(data: T, delay = 1000): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), delay));
};

// Mock function to simulate connecting to PowerSchool API
export const connectToPowerSchool = async (url: string, clientId: string, clientSecret: string): Promise<boolean> => {
  console.log('Connecting to PowerSchool with:', { url, clientId, clientSecret });
  // In a real app, this would be an OAuth2 flow.
  // Here, we just check if the fields are not empty and return a success mock.
  if (url && clientId && clientSecret) {
    return mockRequest(true);
  }
  return mockRequest(false, 200);
};

// Mock function to get a list of students
export const getStudents = async (): Promise<Student[]> => {
  return mockRequest(MOCK_STUDENTS);
};

// Mock function to get detailed data for a single student
export const getStudentData = async (studentId: string): Promise<string> => {
  const data = MOCK_STUDENT_DATA[studentId] || 'No data found for this student.';
  return mockRequest(data, 500);
};
