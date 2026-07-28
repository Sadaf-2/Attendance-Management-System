import { useEffect, useState } from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [currentTime, setCurrentTime] = useState(
    new Date()
  );

  useEffect(() => {

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);

  }, []);

  const handleLogout = () => {

    localStorage.removeItem("user");

    navigate("/login");

  };

  const pageTitles: Record<string, string> = {

    "/dashboard": "Dashboard",

    "/students": "Students",

    "/attendance": "Attendance",

    "/attendance-history": "Attendance History",

    "/reports": "Reports",

  };

  const currentPage =
    pageTitles[location.pathname] ||
    "Attendance Management System";

  return (

    <div className="bg-white shadow-md px-8 py-4 flex justify-between items-center">

      <div>

        <h1 className="text-2xl font-bold text-slate-800">
          {currentPage}
        </h1>

        <p className="text-gray-500 mt-1">
          Welcome Back, {user?.name || "User"}
        </p>

      </div>

      <div className="flex items-center gap-6">

        <div className="text-right">

          <p className="font-semibold text-slate-700">
            {currentTime.toLocaleDateString()}
          </p>

          <p className="text-sm text-gray-500">
            {currentTime.toLocaleTimeString()}
          </p>

        </div>

        <div className="text-right">

          <h2 className="font-semibold text-slate-700">
            {user?.name || "User"}
          </h2>

          <p className="text-sm text-gray-500">
            {user?.email || ""}
          </p>

        </div>

        <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center text-lg font-bold">

          {user?.name
            ? user.name.charAt(0).toUpperCase()
            : "U"}

        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition duration-300"
        >
          Logout
        </button>

      </div>

    </div>

  );

}

export default Navbar;