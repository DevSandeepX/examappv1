import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rollno: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  examResult: {
    rightAns: {
      type: Number,
      default: 0
    },
    wrongAns: {
      type: Number,
      default: 0
    },
    unanswered: {
      type: Array,
      default: []
    },
    attempt: {
      type: Number,
      default: 0
    },
  },
  examStatus: {
    type: String,
    enum: ['in-progress', 'finished'],
    default: 'in-progress'
  },
  examStartTime: {
    type: Date,
    required: true
  }, // Time when the exam was started
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User
