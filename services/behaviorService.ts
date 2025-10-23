const MOCK_BEHAVIOR_DATA: { [key: string]: string } = {
    '101': `
      Observation Date: 2023-10-26
      Observer: Mrs. Davis
      Notes: John was highly engaged during the group activity on historical documents. He helped his peers understand the task. However, he was distracted during independent reading time and needed several reminders to stay on task.
    `,
    '102': `
      Observation Date: 2023-10-25
      Observer: Mr. Smith
      Notes: Jane consistently demonstrates leadership qualities. She is respectful to peers and teachers and takes initiative in classroom management. An exemplary role model.
    `,
    '103': `
      Observation Date: 2023-10-24
      Observer: Mrs. Davis
      Notes: Peter seems withdrawn and has not been participating in class discussions. He has submitted his last two assignments late. Recommend a student-teacher check-in.
    `,
    '104': `
      Observation Date: 2023-10-27
      Observer: Mr. Thompson
      Notes: Mary shows great enthusiasm and creativity. She can sometimes get overly excited and talk over her peers during group work. Needs gentle reminders about active listening.
    `,
};

// Mocks a network request
const mockRequest = <T,>(data: T, delay = 1000): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(data), delay));
};

// Mock function to simulate connecting to a behavior tracking system
export const connectToBehaviorSystem = async (): Promise<boolean> => {
    console.log('Connecting to internal behavior system...');
    // This is simpler, assuming an internal authenticated system
    return mockRequest(true, 500);
};

// Mock function to get detailed behavior notes for a single student
export const getStudentBehaviorData = async (studentId: string): Promise<string> => {
    const data = MOCK_BEHAVIOR_DATA[studentId] || 'No behavioral notes found for this student.';
    return mockRequest(data, 700);
};
