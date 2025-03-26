import User from '../models/User.js';  // Assuming the User model is imported from here

// Add Student Controller
export const addStudent = async (req, res) => {
  try {
    const { name, rollno,course } = req.body;  // Extract name and rollno from the request body

    // Check if user already exists with the same rollno
    const existingUser = await User.findOne({ rollno });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Student with this rollno already exists.' });
    }

    // Create a new user (student)
    const newStudent = new User({
      name,
      rollno,
      course,
      examStatus: 'in-progress', // By default, a new student starts with an 'in-progress' exam status
      examResult: {
        rightAns: 0,
        wrongAns: 0,
        unanswered: [],
        attempt: 0,
      },
      examStartTime: new Date(), // You can set a default or null value depending on your use case
    });

    // Save the new student to the database
    await newStudent.save();

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Student added successfully!',
      student: newStudent, // Return the created student (optional, you can exclude this if not needed)
    });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};



// Controller to fetch all students
export const getAllStudents = async (req, res) => {
  try {
    // Fetch all students from the database
    const students = await User.find();

    // If no students found
    if (students.length === 0) {
      return res.status(404).json({ success: false, message: 'No students found' });
    }

    // Return the students
    return res.status(200).json({ success: true, data: students });
  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

// controllers/admin/studentController.js


// Delete student by ID
export const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await User.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting student',
    });
  }
};


// controllers/admin/studentController.js


// Update student by ID
export const updateStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedStudent = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: updatedStudent,
    });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating student',
    });
  }
};


// controllers/verifyStudentController.js

// Dummy student data (replace with DB if needed)


// Verify student function


// Verify student function
export const verifyStudent = async (req, res) => {
  const { rollno, password } = req.body;

  // Check if roll number and password are provided
  if (!rollno || !password) {
    return res.status(400).json({
      success: false,
      message: 'Roll number and password are required!',
    });
  }

  try {
    // Find student with matching roll number
    const student = await User.findOne({ rollno });

    // Check if student exists and password matches
    if (student && password === 'giit@123') {
      return res.status(200).json({
        success: true,
        message: 'Student verified successfully!',
        rollno: student.rollno,
        id:student._id
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid roll number or password!',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error!',
    });
  }
};








