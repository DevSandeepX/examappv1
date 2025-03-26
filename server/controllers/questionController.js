// controllers/questionController.js
import Question from "../models/questionModels.js";

// Function to shuffle questions
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Fetch and shuffle questions
export const getShuffledQuestions = async (req, res) => {
  try {
    // Fetch all questions from DB
    const questions = await Question.find();

    if (!questions || questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No questions found!',
      });
    }

    // Shuffle questions
    const shuffledQuestions = shuffleArray(questions);

    // Get only 100 questions
    const selectedQuestions = shuffledQuestions.slice(0, 100);

    res.status(200).json({
      success: true,
      count: selectedQuestions.length,
      questions: selectedQuestions,
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching questions',
      error: error.message,
    });
  }
};
