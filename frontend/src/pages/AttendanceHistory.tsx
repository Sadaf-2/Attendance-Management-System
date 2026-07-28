import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import API from "../services/api";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface AttendanceRecord {
  id: number;
  name: string;
  roll_no: string;
  department: string;
  semester: number;
  attendance: number;
  present: boolean;
  date: string;
}

function AttendanceHistory() {

  const [history, setHistory] =
    useState<AttendanceRecord[]>([]);

  const [filteredHistory, setFilteredHistory] =
    useState<AttendanceRecord[]>([]);

  const [search, setSearch] =
    useState("");

  const [selectedDate, setSelectedDate] =
    useState("");

  const [selectedStatus, setSelectedStatus] =
    useState("All");

  useEffect(() => {
    getHistory();
  }, []);

  useEffect(() => {

    let filtered = [...history];

    if (search !== "") {

      filtered = filtered.filter(
        (item) =>
          item.name
            .toLowerCase()
            .includes(search.toLowerCase()) ||

          item.roll_no
            .toLowerCase()
            .includes(search.toLowerCase())
      );

    }

    if (selectedDate !== "") {

      filtered = filtered.filter(
        (item) => item.date === selectedDate
      );

    }

    if (selectedStatus !== "All") {

      filtered = filtered.filter((item) =>

        selectedStatus === "Present"
          ? item.present
          : !item.present

      );

    }

    setFilteredHistory(filtered);

  }, [
    history,
    search,
    selectedDate,
    selectedStatus,
  ]);

  const getHistory = async () => {

    try {

      const response =
        await API.get("/attendance");

      const sorted =
        response.data.sort(
          (a: AttendanceRecord, b: AttendanceRecord) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime()
        );

      setHistory(sorted);
      setFilteredHistory(sorted);

    } catch (error) {

      console.log(error);

    }

  };

  const totalRecords =
    filteredHistory.length;

  const presentCount =
    filteredHistory.filter(
      (item) => item.present
    ).length;

  const absentCount =
    totalRecords - presentCount;

  const attendancePercentage =
    totalRecords > 0
      ? (
          (presentCount / totalRecords) *
          100
        ).toFixed(1)
      : "0";

  const exportPDF = () => {

    const doc = new jsPDF();

    doc.text(
      "Attendance History Report",
      14,
      15
    );

    autoTable(doc, {

      head: [[
        "Name",
        "Roll No",
        "Department",
        "Semester",
        "Status",
        "Date"
      ]],

      body: filteredHistory.map((item) => [

        item.name,

        item.roll_no,

        item.department,

        item.semester,

        item.present
          ? "Present"
          : "Absent",

        item.date

      ]),

      startY: 25

    });

    doc.save(
      "Attendance_History.pdf"
    );

  };

  const exportExcel = () => {

    const worksheet =
      XLSX.utils.json_to_sheet(

        filteredHistory.map((item) => ({

          Name: item.name,

          Roll_No: item.roll_no,

          Department: item.department,

          Semester: item.semester,

          Status: item.present
            ? "Present"
            : "Absent",

          Date: item.date

        }))

      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Attendance"
    );

    const excelBuffer =
      XLSX.write(
        workbook,
        {
          bookType: "xlsx",
          type: "array"
        }
      );

    const blob =
      new Blob(
        [excelBuffer],
        {
          type:
            "application/octet-stream"
        }
      );

    saveAs(
      blob,
      "Attendance_History.xlsx"
    );
  };
    return (
    <div className="flex min-h-screen bg-slate-100">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-8">

          <h1 className="text-3xl font-bold text-slate-800">
            Attendance History
          </h1>

          <p className="text-gray-500 mb-6">
            View attendance records of all students
          </p>

          {/* Search + Filters */}

          <div className="bg-white rounded-xl shadow-md p-5 mb-6">

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

              <input
                type="text"
                placeholder="Search Name or Roll No"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded-lg p-3"
              />

              <input
                type="date"
                value={selectedDate}
                onChange={(e) =>
                  setSelectedDate(e.target.value)
                }
                className="border rounded-lg p-3"
              />

              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value)
                }
                className="border rounded-lg p-3"
              >
                <option value="All">All Status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>

              <button
                onClick={() => {
                  setSearch("");
                  setSelectedDate("");
                  setSelectedStatus("All");
                }}
                className="bg-gray-700 hover:bg-gray-800 text-white rounded-lg"
              >
                Reset Filters
              </button>

            </div>

          </div>

          {/* Export Buttons */}

          <div className="flex gap-4 mb-6">

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

          {/* Cards */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-gray-500">
                Total Records
              </h3>

              <p className="text-4xl font-bold text-blue-600 mt-3">
                {totalRecords}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-gray-500">
                Present
              </h3>

              <p className="text-4xl font-bold text-green-600 mt-3">
                {presentCount}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-gray-500">
                Absent
              </h3>

              <p className="text-4xl font-bold text-red-600 mt-3">
                {absentCount}
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

          {/* Table */}

          <div className="bg-white rounded-xl shadow-md overflow-x-auto">

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

                  <th className="p-4 text-left">
                    Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredHistory.length > 0 ? (

                  filteredHistory.map((item) => (

                    <tr
                      key={item.id}
                      className="border-b hover:bg-slate-50"
                    >

                      <td className="p-4">
                        {item.name}
                      </td>

                      <td className="p-4">
                        {item.roll_no}
                      </td>

                      <td className="p-4">
                        {item.department}
                      </td>

                      <td className="p-4">
                        {item.semester}
                      </td>

                      <td className="p-4">

                        {item.present ? (

                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                            Present
                          </span>

                        ) : (

                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
                            Absent
                          </span>

                        )}

                      </td>

                      <td className="p-4">
                        {item.date}
                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan={6}
                      className="text-center p-8 text-gray-500"
                    >
                      No Attendance Record Found
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

export default AttendanceHistory;