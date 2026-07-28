import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AttendanceChart from "../components/AttendanceChart";

import API from "../services/api";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function Reports() {

  const [students, setStudents] = useState<any[]>([]);

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

  const totalStudents = students.length;

  const presentStudents = students.filter(
    (student) => student.present
  ).length;

  const absentStudents = totalStudents - presentStudents;

  const attendancePercentage =
    totalStudents > 0
      ? Math.round(
          (presentStudents / totalStudents) * 100
        )
      : 0;

  // ==========================
  // Export PDF
  // ==========================

  const exportPDF = () => {

    const doc = new jsPDF();

    doc.text(
      "Attendance Report",
      14,
      15
    );

    autoTable(doc, {

      startY: 25,

      head: [[
        "Name",
        "Roll No",
        "Department",
        "Semester",
        "Status"
      ]],

      body: students.map((student) => [

        student.name,

        student.roll_no,

        student.department,

        student.semester,

        student.present
          ? "Present"
          : "Absent"

      ])

    });

    doc.save("attendance-report.pdf");

  };

  // ==========================
  // Export Excel
  // ==========================

  const exportExcel = () => {

    const excelData = students.map((student) => ({

      Name: student.name,

      Roll_No: student.roll_no,

      Department: student.department,

      Semester: student.semester,

      Attendance: student.attendance,

      Status: student.present
        ? "Present"
        : "Absent"

    }));

    const worksheet =
      XLSX.utils.json_to_sheet(excelData);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

      workbook,

      worksheet,

      "Attendance Report"

    );

    const excelBuffer = XLSX.write(

      workbook,

      {

        bookType: "xlsx",

        type: "array"

      }

    );

    const blob = new Blob(

      [excelBuffer],

      {

        type:
          "application/octet-stream"

      }

    );

    saveAs(

      blob,

      "attendance-report.xlsx"

    );

  };
    return (

    <div className="flex min-h-screen bg-slate-100">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-8">

          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Attendance Report
          </h1>

          <p className="text-gray-500 mb-6">
            Student Attendance Summary
          </p>

          {/* Export Buttons */}

          <div className="flex gap-4 mb-8">

            <button
              onClick={exportPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
            >
              📄 Export PDF
            </button>

            <button
              onClick={exportExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg"
            >
              📊 Export Excel
            </button>

          </div>

          {/* Stats Cards */}

          <div className="grid grid-cols-4 gap-6 mb-8">

            <div className="bg-white rounded-xl shadow-md p-6">

              <h3 className="text-gray-500">
                Total Students
              </h3>

              <p className="text-4xl font-bold text-blue-600 mt-3">
                {totalStudents}
              </p>

            </div>

            <div className="bg-white rounded-xl shadow-md p-6">

              <h3 className="text-gray-500">
                Present
              </h3>

              <p className="text-4xl font-bold text-green-600 mt-3">
                {presentStudents}
              </p>

            </div>

            <div className="bg-white rounded-xl shadow-md p-6">

              <h3 className="text-gray-500">
                Absent
              </h3>

              <p className="text-4xl font-bold text-red-600 mt-3">
                {absentStudents}
              </p>

            </div>

            <div className="bg-white rounded-xl shadow-md p-6">

              <h3 className="text-gray-500">
                Attendance %
              </h3>

              <p className="text-4xl font-bold text-purple-600 mt-3">
                {attendancePercentage}%
              </p>

            </div>

          </div>

          {/* Attendance Chart */}

          <AttendanceChart
            total={totalStudents}
            present={presentStudents}
            absent={absentStudents}
          />

        </div>

      </div>

    </div>

  );

}

export default Reports;