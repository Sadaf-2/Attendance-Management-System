import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StudentCard";
import StudentForm from "../components/StudentForm";
import StudentTable from "../components/StudentTable";
import AttendanceChart from "../components/AttendanceChart";

import API from "../services/api";


function Dashboard() {


  const [students, setStudents] = useState<any[]>([]);

  const [attendanceHistory, setAttendanceHistory] =
    useState<any[]>([]);

  const [editStudent, setEditStudent] =
    useState<any>(null);


  const [search, setSearch] =
    useState("");

  const [department, setDepartment] =
    useState("");




  useEffect(() => {

    fetchStudents();

    fetchAttendanceHistory();

  }, []);






  // ==========================
  // Fetch Students
  // ==========================

  const fetchStudents = async () => {

    try {

      const response =
        await API.get("/students");


      setStudents(response.data);


    } catch(error) {

      console.log(error);

    }

  };







  // ==========================
  // Fetch Recent Attendance
  // ==========================

  const fetchAttendanceHistory = async () => {

    try {

      const response =
        await API.get("/attendance");


      setAttendanceHistory(
        response.data.slice(0,5)
      );


    } catch(error) {

      console.log(error);

    }

  };







  // ==========================
  // Search + Filter
  // ==========================

  const filteredStudents =
    students.filter((student:any)=>{


      const matchesSearch =

        student.name
        .toLowerCase()
        .includes(search.toLowerCase())

        ||

        student.roll_no
        .toLowerCase()
        .includes(search.toLowerCase());



      const matchesDepartment =

        department === ""

        ||

        student.department === department;



      return matchesSearch && matchesDepartment;


    });








  // ==========================
  // Delete Student
  // ==========================

  const deleteStudent =
    async(id:number)=>{


    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this student?"
      );


    if(!confirmDelete)
      return;



    try {


      await API.delete(
        `/students/${id}`
      );


      alert(
        "Student Deleted Successfully"
      );


      fetchStudents();



    }catch(error){


      console.log(error);


    }


  };









  // ==========================
  // Edit Student
  // ==========================

  const handleEdit =
    (student:any)=>{


      setEditStudent(student);


    };





  const clearEdit = ()=>{

    setEditStudent(null);

  };









  // ==========================
  // Mark Attendance
  // ==========================

  const markAttendance =
    async(id:number)=>{


    try{


      await API.put(
        `/attendance/${id}`,
        {
          present:true
        }
      );



      alert(
        "Attendance Marked Successfully"
      );



      fetchStudents();

      fetchAttendanceHistory();



    }catch(error){


      console.log(error);


      alert(
        "Attendance Failed"
      );


    }


  };







  const presentStudents =
    students.filter(
      (student:any)=>student.present
    ).length;



  const absentStudents =
    students.length - presentStudents;







  const attendancePercentage =

    students.length

    ?

    `${Math.round(
      (presentStudents /
      students.length)
      *100
    )}%`

    :

    "0%";









  return (

<div className="flex min-h-screen bg-slate-100">


<Sidebar />



<div className="flex-1">


<Navbar />



<div className="p-8">





<h1 className="text-3xl font-bold text-slate-800">

Attendance Dashboard

</h1>




<p className="text-gray-500 mt-2 mb-8">

Welcome to Attendance Management System

</p>








{/* Stats Cards */}


<div className="grid grid-cols-4 gap-6 mb-8">


<StatsCard

title="Total Students"

value={students.length}

color="text-blue-600"

/>



<StatsCard

title="Present Today"

value={presentStudents}

color="text-green-600"

/>




<StatsCard

title="Absent Today"

value={absentStudents}

color="text-red-600"

/>





<StatsCard

title="Attendance %"

value={attendancePercentage}

color="text-purple-600"

/>



</div>








{/* Chart */}


<AttendanceChart

total={students.length}

present={presentStudents}

absent={absentStudents}

/>









{/* Recent Attendance */}


<div className="bg-white rounded-xl shadow-md p-6 mt-8">


<h2 className="text-xl font-bold text-slate-800 mb-4">

Recent Attendance Activity

</h2>



{

attendanceHistory.length > 0 ?


attendanceHistory.map((item:any)=>(


<div

key={item.id}

className="
flex
justify-between
items-center
border-b
py-3
"


>


<div>


<p className="font-semibold">

{item.name}

</p>



<p className="text-gray-500 text-sm">

{item.roll_no}

</p>



</div>





<div>


{

item.present ?


<span className="
bg-green-100
text-green-700
px-3 py-1
rounded-full
">

Present

</span>



:


<span className="
bg-red-100
text-red-700
px-3 py-1
rounded-full
">

Absent

</span>



}



</div>


</div>


))


:




<p className="text-gray-500">

No recent attendance found.

</p>



}



</div>









{/* Search Filter */}


<div className="bg-white rounded-xl shadow-md p-5 mt-8 mb-6">


<div className="grid grid-cols-2 gap-4">



<input

type="text"

placeholder="🔍 Search by Name or Roll Number..."

value={search}

onChange={(e)=>
setSearch(e.target.value)
}

className="
border
rounded-lg
p-3
"

/>






<select

value={department}

onChange={(e)=>
setDepartment(e.target.value)
}

className="
border
rounded-lg
p-3
"

>


<option value="">
All Departments
</option>


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








{/* Student Form */}


<StudentForm

onStudentAdded={fetchStudents}

editStudent={editStudent}

clearEdit={clearEdit}

/>









{/* Student Table */}


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


export default Dashboard;