type Student = {
  id: number;
  name: string;
  roll_no: string;
  department: string;
  semester: string;
  attendance: number;
  present?: boolean;
};

type Props = {
  students: Student[];
  onDelete: (id: number) => void;
  onEdit: (student: Student) => void;
  onAttendance: (id: number) => void;
};

function StudentTable({
  students,
  onDelete,
  onEdit,
  onAttendance,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md mt-8 overflow-x-auto">
      <div className="p-5 border-b">
        <h2 className="text-xl font-bold text-slate-700">
          Student List
        </h2>
      </div>

      <table className="min-w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-4 text-left">ID</th>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Roll No</th>
            <th className="p-4 text-left">Department</th>
            <th className="p-4 text-left">Semester</th>
            <th className="p-4 text-left">Attendance</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr
                key={student.id}
                className="border-b hover:bg-slate-50"
              >
                <td className="p-4">{student.id}</td>

                <td className="p-4 font-medium">
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
                  {student.attendance}
                </td>

                <td className="p-4 text-center">
                  {student.present ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      Present
                    </span>
                  ) : (
                    <button
                      onClick={() => onAttendance(student.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Mark Present
                    </button>
                  )}
                </td>

                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(student)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(student.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={8}
                className="text-center py-8 text-gray-500"
              >
                No Students Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StudentTable;