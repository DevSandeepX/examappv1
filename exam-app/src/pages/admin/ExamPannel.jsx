import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/admin/Sidebar';
import { useNavigate } from 'react-router-dom';

const CompletedStudents = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Redirect to login if no token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Fetch students who completed the exam
  const fetchStudents = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.get(`${backendUrl}/api/admin/students`);
      
      if (response.data.success) {
        // Filter students with examStatus === 'finished'
        const completedStudents = response.data.data.filter(
          (student) => student.examStatus === 'finished'
        );
        setStudents(completedStudents);
      } else {
        alert('Failed to fetch students.');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Something went wrong while fetching students.');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="grid grid-cols-[20%_78%] gap-4 min-h-screen">
      <Sidebar />
      
      {/* Main Content */}
      <div className="p-6 bg-gray-50 w-full">
        {/* Header Section */}
        <div className="flex justify-between items-center gap-12 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Roll No. or Course"
            className="flex-1 border border-gray-400 rounded px-4 py-2 outline-none"
          />
        </div>

        {/* Students Table */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <h2 className="text-2xl font-bold text-gray-700 px-6 py-4 bg-gray-100">
            Students Who Completed the Exam
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-green-500 text-white">
                <tr>
                  <th className="py-3 px-4 text-left text-sm">Name</th>
                  <th className="py-3 px-4 text-left text-sm">Roll No.</th>
                  <th className="py-3 px-4 text-left text-sm">Course</th>
                  <th className="py-3 px-4 text-left text-sm">Right Answers</th>
                  <th className="py-3 px-4 text-left text-sm">Wrong Answers</th>
                  <th className="py-3 px-4 text-left text-sm">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {students.length > 0 ? (
                  students
                    .filter(
                      (student) =>
                        student.rollno.toLowerCase().includes(search.toLowerCase()) ||
                        student.course.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((student) => (
                      <tr
                        key={student._id}
                        className="border-b hover:bg-gray-50 transition duration-200"
                      >
                        <td className="py-3 px-4">{student.name}</td>
                        <td className="py-3 px-4">{student.rollno}</td>
                        <td className="py-3 px-4">{student.course.toUpperCase()}</td>
                        <td className="py-3 px-4">{student.examResult?.rightAns ?? 'N/A'}</td>
                        <td className="py-3 px-4">{student.examResult?.wrongAns ?? 'N/A'}</td>
                        <td className="py-3 px-4 capitalize text-green-600 font-semibold">
                          {student.examStatus}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      No students have completed the exam.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedStudents;
