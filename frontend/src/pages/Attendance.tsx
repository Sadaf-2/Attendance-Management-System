import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import API from "../services/api";

interface Student {
  id: number;
  name: string;
  roll_no: string;
  department: string;
  semester: number;
  attendance: number;
  present: boolean;
}

function Attendance() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = async () => {
    setLoading(true);

    try {
      const response = await API.get("/students");

      setStudents(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (
    id: number,
    status: boolean
  ) => {
    try {
      await API.put(`/attendance/${id}`, {
        present: status,
        date: selectedDate,
      });

      toast.success("Attendance Updated");

      getStudents();
    } catch (error) {
      console.log(error);
      toast.error("Attendance Failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-8">

          <h1 className="text-3xl font-bold text-slate-800">
            Attendance
          </h1>

          <p className="text-gray-500 mb-6">
            Mark student attendance
          </p>

          <div className="bg-white rounded-xl shadow-md p-5 mb-6">

            <label className="block font-semibold mb-2">
              Attendance Date
            </label>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) =>
                setSelectedDate(e.target.value)
              }
              className="border rounded-lg p-3 w-64"
            />

          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">

            <table className="w-full">

              <thead className="bg-slate-900 text-white">

                <tr>

                  <th className="p-4 text-left">
                    Name
                  </th>

                  <th className="p-4 text-left">
                    Roll No
                  </th>

                  <th className="p-4 text-left">
                    Department
                  </th>

                  <th className="p-4 text-left">
                    Semester
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                  <th className="p-4 text-center">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>
                                {loading ? (

                  <tr>

                    <td
                      colSpan={6}
                      className="text-center py-6"
                    >
                      Loading...
                    </td>

                  </tr>

                ) : students.length > 0 ? (

                  students.map((student) => (

                    <tr
                      key={student.id}
                      className="border-b hover:bg-slate-50"
                    >

                      <td className="p-4">
                        {student.name}
                      </td>

                      <td className="p-4">
                        {student.roll_no}
                      </td>

                      <td className="p-4">
                        {student.department}
                      </td>

                      <td className="p-4">
                        {student.semester}
                      </td>

                      <td className="p-4">

                        {student.present ? (

                          <span className="text-green-600 font-semibold">
                            Present
                          </span>

                        ) : (

                          <span className="text-red-600 font-semibold">
                            Absent
                          </span>

                        )}

                      </td>

                      <td className="p-4 flex justify-center gap-2">

                        <button
                          onClick={() =>
                            markAttendance(
                              student.id,
                              true
                            )
                          }
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                        >
                          Present
                        </button>

                        <button
                          onClick={() =>
                            markAttendance(
                              student.id,
                              false
                            )
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                        >
                          Absent
                        </button>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      No Students Found
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
}

export default Attendance;
            
              