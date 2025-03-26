import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/admin/Sidebar';
import { useNavigate } from 'react-router-dom';

const AddStudent = () => {
  const [student, setStudent] = useState({
    name: '',
    rollno: '',
    examStartTime: '',
    course: '', // Added course field
  });

  const [search, setSearch] = useState('');
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState({});

  const navigate = useNavigate();

  // Redirect to login if no token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.get(`${backendUrl}/api/admin/students`);
      setStudents(response.data.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle input changes
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit form to add student
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.post(
        `${backendUrl}/api/admin/add-student`,
        student,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        alert('Student added successfully!');
        setStudent({
          name: '',
          rollno: '',
          examStartTime: '',
          course: '',
        });
        fetchStudents();
      } else {
        alert(response.data.message || 'Failed to add student.');
      }
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Something went wrong while adding the student.');
    }
  };

  // Handle edit
  const handleEdit = (id) => {
    const studentToEdit = students.find((student) => student._id === id);
    setSelectedStudent(studentToEdit);
    setEditId(id);
  };

  // Handle update
  const handleUpdate = async (id) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.put(
        `${backendUrl}/api/admin/update-student/${id}`,
        selectedStudent
      );

      if (response.data.success) {
        alert('Student updated successfully!');
        setEditId(null);
        fetchStudents();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.delete(
        `${backendUrl}/api/admin/delete-student/${id}`
      );

      if (response.data.success) {
        alert('Student deleted successfully!');
        fetchStudents();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  // Handle input change in edit mode
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="grid grid-cols-[20%_78%] gap-4 min-h-screen">
      <Sidebar />

      {/* Main Content */}
      <div className="p-6 w-full bg-gray-50">
        {/* Search Bar */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by roll no"
            className="px-4 py-2 border rounded-lg w-full max-w-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Add Student Form */}
        <div className="bg-white max-w-lg mx-auto p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">Add New Student</h2>

          <form onSubmit={handleOnSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={student.name}
                onChange={handleOnChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Roll No.</label>
              <input
                type="text"
                name="rollno"
                value={student.rollno}
                onChange={handleOnChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Exam Start Time</label>
              <input
                type="datetime-local"
                name="examStartTime"
                value={student.examStartTime}
                onChange={handleOnChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Course Dropdown */}
            <div className="mb-4">
              <label className="block text-gray-700">Course</label>
              <select
                name="course"
                value={student.course}
                onChange={handleOnChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">Select Course</option>
                <option value="dca">DCA</option>
                <option value="adca">ADCA</option>
                <option value="doa">DOA</option>
                <option value="dcm">dcm</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
            >
              Add Student
            </button>
          </form>
        </div>

        {/* Student List */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">All Students</h2>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-500 text-white">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Roll No.</th>
                <th className="py-2 px-4">Exam Start Time</th>
                <th className="py-2 px-4">Course</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students
                .filter((student) =>
                  student.rollno.toLowerCase().includes(search.toLowerCase())
                )
                .map((student) => (
                  <tr key={student._id} className="border-b">
                    <td className="py-2 px-4">
                      {editId === student._id ? (
                        <input
                          name="name"
                          value={selectedStudent.name || ''}
                          onChange={handleEditChange}
                          className="border px-2 py-1 rounded"
                        />
                      ) : (
                        student.name
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {editId === student._id ? (
                        <input
                          name="rollno"
                          value={selectedStudent.rollno || ''}
                          onChange={handleEditChange}
                          className="border px-2 py-1 rounded"
                        />
                      ) : (
                        student.rollno
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {editId === student._id ? (
                        <input
                          type="datetime-local"
                          name="examStartTime"
                          value={selectedStudent.examStartTime || ''}
                          onChange={handleEditChange}
                          className="border px-2 py-1 rounded"
                        />
                      ) : (
                        new Date(student.examStartTime).toLocaleString()
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {editId === student._id ? (
                        <select
                          name="course"
                          value={selectedStudent.course || ''}
                          onChange={handleEditChange}
                          className="border px-2 py-1 rounded"
                        >
                          <option value="">Select Course</option>
                          <option value="B.Tech">B.Tech</option>
                          <option value="BCA">BCA</option>
                          <option value="MCA">MCA</option>
                          <option value="MBA">MBA</option>
                        </select>
                      ) : (
                        student.course
                      )}
                    </td>
                    <td className="py-2 px-4 flex space-x-2">
                      {editId === student._id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(student._id)}
                            className="bg-blue-500 text-white px-2 py-1 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="bg-gray-500 text-white px-2 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEdit(student._id)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
