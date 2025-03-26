import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams , useNavigate} from "react-router-dom";

const Exam = () => {
  const navigate = useNavigate()
  const { rollno } = useParams();
  const [questions, setQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(90 * 60); // 1 hour 30 mins in seconds
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Use VITE_BACKEND_URL from .env
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(
          backendUrl + '/api/question/suffled-question'
        );
        setQuestions(res.data.questions);
      } catch (error) {
        console.error('❌ Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [backendUrl]);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) {
      alert('⏰ Time is up! Submitting your exam...');
      handleSubmit();
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Handle answer selection
  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers({
      ...answers,
      [questionId]: selectedOption,
    });
  };

  // Handle next and previous navigation
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Handle exam submission
  const handleSubmit = async () => {
    const unansweredQuestions = questions
      .filter((q) => !answers[q._id])
      .map((q) => q._id);

    let rightAns = 0;
    let wrongAns = 0;

    // Check answers against correct ones
    questions.forEach((q) => {
      if (answers[q._id]) {
        const selectedOptionIndex = [
          q.option1,
          q.option2,
          q.option3,
          q.option4,
        ].indexOf(answers[q._id]) + 1;

        if (selectedOptionIndex === q.answer) {
          rightAns++;
        } else {
          wrongAns++;
        }
      }
    });

    try {
      console.log('📡 Submitting exam to:', backendUrl + '/api/exam/finish-exam');
      console.log('Payload:', {
        rollno,
        rightAns,
        wrongAns,
        unanswered: unansweredQuestions,
      });

      const res = await axios.post(backendUrl + '/api/exam/finish-exam', {
        rollno,
        rightAns,
        wrongAns,
        unanswered: unansweredQuestions,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      

      console.log('✅ Response:', res.data);

      if (res.data.success) {
        alert('✅ Exam submitted successfully!');
        navigate('/');
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert('❌ Something went wrong while submitting.');
    }
  };

  if (questions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        ⏳ Loading questions...
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-100 p-4 relative">
      {/* Finish Exam Button on Top Right */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handleSubmit}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-200"
        >
          📝 Finish Exam
        </button>
      </div>

      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-bold text-gray-700">
          ⏳ Time Remaining: {formatTime(timeLeft)}
        </div>
        <div className="text-lg font-bold text-blue-600">
          👤 Roll No: {rollno || 'Unknown'}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">
          {currentQuestion + 1}. {currentQ.question}
        </h3>
        <div className="space-y-2">
          {[currentQ.option1, currentQ.option2, currentQ.option3, currentQ.option4].map(
            (option, idx) => (
              <label
                key={idx}
                className={`block cursor-pointer p-2 border rounded-lg ${
                  answers[currentQ._id] === option
                    ? 'bg-blue-100 border-blue-500'
                    : 'border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQ._id}`}
                  value={option}
                  checked={answers[currentQ._id] === option}
                  onChange={() => handleOptionChange(currentQ._id, option)}
                  className="mr-2"
                />
                {option}
              </label>
            )
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className={`bg-gray-500 text-white px-4 py-2 rounded-lg ${
            currentQuestion === 0
              ? 'cursor-not-allowed opacity-50'
              : 'hover:bg-gray-600'
          }`}
        >
          ⏮️ Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentQuestion === questions.length - 1}
          className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${
            currentQuestion === questions.length - 1
              ? 'cursor-not-allowed opacity-50'
              : 'hover:bg-blue-600'
          }`}
        >
          ⏭️ Next
        </button>
      </div>
    </div>
  );
};

export default Exam;
