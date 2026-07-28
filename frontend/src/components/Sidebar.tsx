import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  BarChart3,
  History,
  LogOut,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

function Sidebar() {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("user");

    navigate("/login");

  };

  return (

    <div className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">

      {/* Logo */}

      <div className="p-6 border-b border-slate-700">

        <h1 className="text-2xl font-bold text-emerald-400">
          AMS
        </h1>

        <p className="text-sm text-slate-400">
          Attendance System
        </p>

      </div>

      {/* Menu */}

      <div className="flex-1 p-4">

        <Link to="/dashboard">

          <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition mb-2">

            <LayoutDashboard size={20} />

            Dashboard

          </button>

        </Link>

        <Link to="/students">

          <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition mb-2">

            <Users size={20} />

            Students

          </button>

        </Link>

        <Link to="/attendance">

          <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition mb-2">

            <ClipboardCheck size={20} />

            Attendance

          </button>

        </Link>

        <Link to="/reports">

          <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition mb-2">

            <BarChart3 size={20} />

            Reports

          </button>

        </Link>

        <Link to="/attendance-history">

          <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition mb-2">

            <History size={20} />

            Attendance History

          </button>

        </Link>

      </div>

      {/* Logout */}

      <div className="p-4 border-t border-slate-700">

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 bg-red-500 hover:bg-red-600 p-3 rounded-lg transition"
        >

          <LogOut size={20} />

          Logout

        </button>

      </div>

    </div>

  );
}

export default Sidebar;