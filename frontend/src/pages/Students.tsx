import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StudentForm from "../components/StudentForm";
import StudentTable from "../components/StudentTable";

import API from "../services/api";

function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [editStudent, setEditStudent] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await API.get("/students");
      setStudents(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteStudent = async (id: number) => {
    if (!window.confirm("Delete this student?")) return;

    try {
      await API.delete(`/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (student: any) => {
    setEditStudent(student);
  };

  const clearEdit = () => {
    setEditStudent(null);
  };

  const markAttendance = async (id: number) => {
    try {
      await API.put(`/attendance/${id}`, {
        present: true,
      });

      fetchStudents();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.roll_no.toLowerCase().includes(search.toLowerCase());

    const matchesDepartment =
      department === "" || student.department === department;

    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Students Management
          </h1>

          <p className="text-gray-500 mb-6">
            Add, Update and Delete Students
          </p>

          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-gray-500">Total Students</h2>

            <p className="text-4xl font-bold text-blue-600 mt-2">
              {students.length}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Search by Name or Roll No..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded-lg p-3"
              />

              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="border rounded-lg p-3"
              >
                <option value="">All Departments</option>

                <option value="Computer Science">
                  Computer Science
                </option>

                <option value="Artificial Intelligence">
                  Artificial Intelligence
                </option>

                <option value="Software Engineering">
                  Software Engineering
                </option>
              </select>
            </div>
          </div>

          <StudentForm
            onStudentAdded={fetchStudents}
            editStudent={editStudent}
            clearEdit={clearEdit}
          />

          <StudentTable
            students={filteredStudents}
            onDelete={deleteStudent}
            onEdit={handleEdit}
            onAttendance={markAttendance}
          />
        </div>
      </div>
    </div>
  );
}

export default Students;