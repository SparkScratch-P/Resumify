import React from "react";

const AssistantPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Assistant</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="mb-4">
          Welcome to the AI Assistant page! This feature will help you improve your resume with AI suggestions.
        </p>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <p className="font-medium">Coming soon:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>AI-powered resume review</li>
            <li>Personalized improvement suggestions</li>
            <li>Skills gap analysis</li>
            <li>Job-specific optimization</li>
          </ul>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default AssistantPage;
