import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Ensure the backend URL is set

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/admin/students`);
        if (response.data.success) {
          setStudents(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch students');
        }
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Something went wrong while fetching students.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [backendUrl]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="text-lg text-gray-600">Loading students...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-semibold mt-8">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">All Students</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse shadow-md bg-white rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Name</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Roll No.</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Exam Status</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Right Answers</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Wrong Answers</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id} className="hover:bg-gray-50">
                <td className="py-4 px-6 text-sm text-gray-700">{student.name}</td>
                <td className="py-4 px-6 text-sm text-gray-700">{student.rollno}</td>
                <td className="py-4 px-6 text-sm text-gray-700">{student.examStatus}</td>
                <td className="py-4 px-6 text-sm text-gray-700">{student.examResult.rightAns}</td>
                <td className="py-4 px-6 text-sm text-gray-700">{student.examResult.wrongAns}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;
