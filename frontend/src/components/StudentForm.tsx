import { useState, useEffect } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

type Student = {
  id?: number;
  name: string;
  roll_no: string;
  department: string;
  semester: string;
};

type Props = {
  onStudentAdded: () => void;
  editStudent: Student | null;
  clearEdit: () => void;
};

function StudentForm({
  onStudentAdded,
  editStudent,
  clearEdit,
}: Props) {
  const [formData, setFormData] = useState<Student>({
    name: "",
    roll_no: "",
    department: "",
    semester: "",
  });

  useEffect(() => {
    if (editStudent) {
      setFormData({
        id: editStudent.id,
        name: editStudent.name,
        roll_no: editStudent.roll_no,
        department: editStudent.department,
        semester: editStudent.semester,
      });
    }
  }, [editStudent]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.roll_no.trim() ||
      !formData.department.trim() ||
      !formData.semester.trim()
    ) {
      toast.warning("Please fill all fields");
      return;
    }

    try {
      if (editStudent) {
        await API.put(
          `/students/${editStudent.id}`,
          {
            name: formData.name,
            roll_no: formData.roll_no,
            department: formData.department,
            semester: formData.semester,
          }
        );

        toast.success("Student Updated Successfully");

        clearEdit();
      } else {
        await API.post("/students", {
          name: formData.name,
          roll_no: formData.roll_no,
          department: formData.department,
          semester: formData.semester,
        });

        toast.success("Student Added Successfully");
      }

      setFormData({
        name: "",
        roll_no: "",
        department: "",
        semester: "",
      });

      onStudentAdded();
    } catch (error) {
      console.log(error);
      toast.error("Operation Failed");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold mb-5">
        {editStudent ? "Update Student" : "Add Student"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Student Name"
          value={formData.name}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="roll_no"
          placeholder="Roll Number"
          value={formData.roll_no}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="semester"
          placeholder="Semester"
          value={formData.semester}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition"
        >
          {editStudent ? "Update Student" : "Add Student"}
        </button>
      </form>
    </div>
  );
}

export default StudentForm;