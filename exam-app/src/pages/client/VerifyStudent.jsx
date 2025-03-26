import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom"
const VerifyStudent = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    rollno: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { rollno, password } = formData;

    if (!rollno || !password) {
      setMessage('❌ Please fill in all fields!');
      return;
    }

    try {
      setLoading(true); // Show loading state
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      
      // Send API request to verify student
      const response = await axios.post(`${backendUrl}/api/user/verify-student`, {
        rollno,
        password,
      });

      if (response.data.success) {
        setMessage(`✅ Verified! Roll No: ${response.data.rollno}`);
        navigate(`/exam/${response.data.rollno}`)

      } else {
        setMessage('❌ Invalid roll number or password!');
      }
    } catch (error) {
      console.error('Error verifying student:', error);
      setMessage('❌ Server error! Please try again later.');
    } finally {
      setLoading(false); // Hide loading
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Verify Student</h2>

        <form onSubmit={handleSubmit}>
          {/* Roll No Input */}
          <div className="mb-4">
            <label className="block text-gray-700">Roll Number</label>
            <input
              type="text"
              name="rollno"
              value={formData.rollno}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        {/* Message Display */}
        {message && (
          <div
            className={`mt-4 p-2 text-center rounded ${
              message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyStudent;
