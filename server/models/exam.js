import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Reference to the user who took the exam

  course: { 
    type: String, 
    required: true 
  }, // The course name or exam name, e.g., 'adca'

  result: {
    rightAns: { 
      type: Number, 
      default: 0 
    }, // Number of correct answers
    wrongAns: { 
      type: Number, 
      default: 0 
    }, // Number of wrong answers
    unanswered: { 
      type: Array, 
      default: [] 
    }, // List of unanswered question IDs or indices
    attempt: { 
      type: Number, 
      default: 0 
    }, // Total number of attempts
  },

  completionTime: { 
    type: Date, 
    default: Date.now 
  }, // Time when the exam was completed

  examStatus: { 
    type: String, 
    enum: ['in-progress', 'finished'], 
    default: 'in-progress' 
  }, // Status of the exam, can be 'in-progress' or 'finished'
  
  startTime: { 
    type: Date, 
    required: true 
  }, // Start time of the exam

  timeTaken: { 
    type: Number, 
    default: 0 
  }, // Time taken to complete the exam (in seconds)
});

const Exam = mongoose.model('Exam', examSchema);

export default Exam;
