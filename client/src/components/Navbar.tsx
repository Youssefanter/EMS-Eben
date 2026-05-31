import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  // Read the role straight from the token
  const token = localStorage.getItem("access");
  let role = "EMPLOYEE";

  if (token) {
    try {
      role = JSON.parse(atob(token.split(".")[1])).role;
    } catch {
      /* ignore error */
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <span className="text-xl font-bold text-gray-800 tracking-tight">
              EMS
            </span>

            <div className="hidden md:flex space-x-6 items-center">
              {/* --- ADMIN & HR ONLY LINKS --- */}
              {role !== "EMPLOYEE" && (
                <>
                  <Link
                    to="/companies"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Companies
                  </Link>
                  <Link
                    to="/departments"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Departments
                  </Link>
                  <Link
                    to="/employees"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Employees
                  </Link>
                </>
              )}

              {/* --- EVERYONE SEES THIS LINK --- */}
              <Link
                to="/profile"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
              >
                My Profile
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
