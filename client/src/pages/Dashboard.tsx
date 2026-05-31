import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface Company {
  id: number;
  name: string;
  address: string;
  departments_count: number;
  employees_count: number;
}

export default function CompaniesList() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Decode the token to figure out who is looking at the screen
  const token = localStorage.getItem("access");
  let userRole = "EMPLOYEE";

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userRole = payload.role || "EMPLOYEE";
    } catch {
      /* ignore error */
    }
  }

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!token) return navigate("/");

      try {
        const response = await fetch("http://127.0.0.1:8000/api/companies/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          setCompanies(await response.json());
        } else {
          toast.error("Failed to load companies.");
        }
      } catch {
        toast.error("Server connection failed.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [navigate, token]);

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this company?",
      )
    )
      return;

    const toastId = toast.loading("Deleting company...");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/companies/${id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok || response.status === 204) {
        setCompanies((prev) => prev.filter((c) => c.id !== id));
        toast.success("Company deleted successfully!", { id: toastId });
      } else {
        toast.error("You do not have permission to delete this company.", {
          id: toastId,
        });
      }
    } catch {
      toast.error("Server connection failed.", { id: toastId });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Registered Companies
        </h1>

        {/* 2. THE LOCK: Only Admins can see the Add Company button! */}
        {userRole === "ADMIN" && (
          <button
            onClick={() => navigate("/companies/add")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors text-sm shadow-sm"
          >
            + Add Company
          </button>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        {loading ? (
          <div className="p-12 text-center text-gray-500 animate-pulse">
            Loading companies...
          </div>
        ) : companies.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg font-medium text-gray-900 mb-2">
              No companies found.
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Company Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Departments
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Employees
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {companies.map((company) => (
                <tr
                  key={company.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    COMP-{company.id}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {company.name}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {company.address || "No address provided"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-xs">
                      {company.departments_count || 0}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-xs">
                      {company.employees_count || 0}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => navigate(`/companies/edit/${company.id}`)}
                      className="text-blue-600 hover:text-blue-900 mr-4 transition-colors"
                    >
                      Edit
                    </button>

                    {userRole === "ADMIN" && (
                      <button
                        onClick={() => handleDelete(company.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
