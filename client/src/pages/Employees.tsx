import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface Employee {
  full_name: string;
  company_name: string;
  department_name: string;
  id: number;
  role: string;
  title: string;
  mobile: string;
  is_active_status: boolean;
  company: number;
  department: number;
}

export default function EmployeesList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      const token = localStorage.getItem("access");
      try {
        const response = await fetch("http://127.0.0.1:8000/api/employees/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          setEmployees(await response.json());
        } else {
          toast.error("Failed to load employees.");
        }
      } catch {
        toast.error("Server connection failed.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to completely remove this employee?",
      )
    )
      return;

    const token = localStorage.getItem("access");
    const toastId = toast.loading("Removing employee...");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/employees/${id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok || response.status === 204) {
        setEmployees((prev) => prev.filter((e) => e.id !== id));
        toast.success("Employee removed successfully!", { id: toastId });
      } else {
        toast.error("Failed to delete employee.", { id: toastId });
      }
    } catch {
      toast.error("Server connection failed.", { id: toastId });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Directory</h1>
        <button
          onClick={() => navigate("/employees/add")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors text-sm shadow-sm"
        >
          + Onboard Employee
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        {loading ? (
          <div className="p-12 text-center text-gray-500 animate-pulse">
            Loading directory...
          </div>
        ) : employees.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg font-medium text-gray-900 mb-2">
              No employees found.
            </p>
            <p>Click the button above to onboard your first team member.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Company & Dept
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  {/* Show Full Name and Job Title */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{emp.full_name}</div>
                    <div className="text-xs text-gray-500">{emp.title || "No Title"}</div>
                  </td>
                  
                  {/* Show Company and Department */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{emp.company_name}</div>
                    <div className="text-xs text-gray-500">{emp.department_name}</div>
                  </td>

                  {/* Show System Role */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {emp.role}
                    </span>
                  </td>

                  {/* Show Status */}
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                    {emp.is_active_status ? (
                      <span className="text-green-600 font-medium text-sm">● Active</span>
                    ) : (
                      <span className="text-red-600 font-medium text-sm">● Inactive</span>
                    )}
                  </td>

                  {/* Delete Button */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDelete(emp.id)} className="text-red-600 hover:text-red-900 transition-colors">
                      Delete
                    </button>
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
