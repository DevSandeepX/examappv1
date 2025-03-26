// src/pages/ExamFinished.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ExamFinished = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-green-500 mb-4">🎉 Exam Finished!</h1>
        <p className="text-lg text-gray-700 mb-6">Thank you for taking the exam. Your responses have been recorded successfully.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          ⏮️ Back to Home
        </button>
      </div>
    </div>
  );
};

export default ExamFinished;
