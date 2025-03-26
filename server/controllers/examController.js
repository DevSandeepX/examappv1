import User from '../models/User.js';

export const finishExam = async (req, res) => {
  try {
    const { rollno, rightAns, wrongAns, unanswered } = req.body;

    // Check if the user exists
    const user = await User.findOne({ rollno });

    if (!user) {
      return res.status(404).json({success:false, message: 'User not found' });
    }

    // Check if the exam is already finished
    if (user.examStatus === 'finished') {
      return res.status(200).json({ success:false, message: 'Exam already finished for this user.' });
    }

    // Calculate total attempted questions
    const attempt = rightAns + wrongAns;

    // Update exam result and status
    user.examResult = {
      rightAns,
      wrongAns,
      unanswered,
      attempt,
    };
    user.examStatus = 'finished';

    // Save updated user data
    await user.save();

    res.status(200).json({
      success:true,
      message: 'Exam finished successfully',
      examResult: user.examResult,
      examStatus: user.examStatus,
    });
  } catch (error) {
    console.error('Error finishing exam:', error);
    res.status(500).json({success:true, message: 'Internal server error' });
  }
};


