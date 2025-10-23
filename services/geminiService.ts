import { GoogleGenAI } from "@google/genai";
import type { StudentData } from '../types';

const generatePrompt = (data: StudentData): string => {
  return `
    **Role:** You are an experienced educator specializing in writing insightful, constructive, and well-structured student progress reports.

    **Task:** Analyze the provided data for a student named **${data.studentName}** and generate a comprehensive progress report. The report should synthesize all information into a coherent narrative.

    **Tone:** Professional, encouraging, and supportive. Focus on growth and actionable feedback. Avoid overly negative language.

    **Input Data:**

    *   **PowerSchool Data (Grades, Attendance, etc.):**
        \`\`\`
        ${data.powerschoolData || 'No PowerSchool data provided.'}
        \`\`\`

    *   **IXL Data (Skills Mastered, Time Spent, etc.):**
        \`\`\`
        ${data.ixlData || 'No IXL data provided.'}
        \`\`\`

    *   **Teacher's Behavioral Notes:**
        \`\`\`
        ${data.behaviorData || 'No behavioral notes provided.'}
        \`\`\`
    
    *   **Specific Focus Area/Concern from Teacher:**
        \`\`\`
        ${data.focusArea || 'No specific focus area provided.'}
        \`\`\`

    **Required Output Format:**

    Generate the report using Markdown. The report MUST include the following sections in this exact order:

    ### **Progress Report: ${data.studentName}**

    #### **I. Overall Summary**
    *A brief, high-level overview of the student's progress this period, touching upon academic, skill, and behavioral aspects.*

    #### **II. Academic Performance (based on PowerSchool)**
    *Analyze the grades, identify trends (e.g., improvement in Math, decline in ELA), and comment on attendance if relevant. Be specific.*

    #### **III. Skill Development (based on IXL)**
    *Interpret the IXL data. Comment on areas of strength, skills mastered, effort (time spent), and any persistent challenges. Connect this to classroom performance where possible.*

    #### **IV. Classroom Behavior & Social-Emotional Growth**
    *Synthesize the behavioral notes into a paragraph describing the student's conduct, participation, collaboration with peers, and attitude towards learning.*

    #### **V. Key Strengths**
    *A bulleted list of 3-5 key positive attributes, skills, or behaviors observed.*
    *   Example: - Proactive in seeking help.
    *   Example: - Demonstrates strong analytical skills in science.

    #### **VI. Areas for Growth & Recommendations**
    *A bulleted list of 3-5 constructive, actionable suggestions for the student, parents, and teacher to support continued development.*
    *   Example: - **For Student:** Practice IXL math skills for 15 minutes daily.
    *   Example: - **For Parents:** Review the student's planner each evening to ensure homework is complete.
    *   Example: - **For Teacher:** Provide more opportunities for leadership roles in group projects.
  `;
};


export const generateReport = async (data: StudentData): Promise<string> => {
    // This is a placeholder for the actual API key, which should be
    // securely managed and not hardcoded. In a real environment,
    // this would be handled by a secure environment variable solution.
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API key is not configured");
    }
  
    const ai = new GoogleGenAI({ apiKey });
  
    const prompt = generatePrompt(data);
  
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
      console.error("Error generating report from Gemini API:", error);
      throw new Error("Failed to generate report. The API may be unavailable or the request was invalid.");
    }
};
