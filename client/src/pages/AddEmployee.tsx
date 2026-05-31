import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface Company {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
  company: number;
}

export default function AddEmployee() {
  const navigate = useNavigate();

  // --- LOGIN CREDENTIAL STATES ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // --- HR DATA STATES ---
  const [companyId, setCompanyId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [role, setRole] = useState("EMPLOYEE");
  const [mobile, setMobile] = useState("");
  const [title, setTitle] = useState("");
  const [hireDate, setHireDate] = useState("");
  const [address, setAddress] = useState("");

  // --- DROPDOWN DATA STATES ---
  const [companies, setCompanies] = useState<Company[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  // 1. Fetch initial dropdown data
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access");
      try {
        const [compRes, deptRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/companies/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://127.0.0.1:8000/api/departments/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (compRes.ok && deptRes.ok) {
          setCompanies(await compRes.json());
          setDepartments(await deptRes.json());
        } else {
          toast.error("Failed to load initial data.");
        }
      } catch {
        toast.error("Server connection failed.");
      }
    };
    fetchData();
  }, []);

  // 2. THE PRO FIX: Calculate filtered departments instantly during render
  const filteredDepartments = companyId
    ? departments.filter((d) => d.company.toString() === companyId)
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId || !departmentId)
      return toast.error("Company and Department are required.");

    const token = localStorage.getItem("access");
    const toastId = toast.loading("Onboarding employee...");

    const payload = {
      // Login Info
      username: username,
      password: password,
      email: email,
      first_name: firstName,
      last_name: lastName,
      // HR Info
      company: parseInt(companyId),
      department: parseInt(departmentId),
      role: role,
      mobile: mobile,
      title: title,
      hire_date: hireDate || null,
      address: address,
      is_active_status: true,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/employees/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Employee successfully onboarded!", { id: toastId });
        navigate("/employees");
      } else {
        const errorData = await response.json();
        const errorMessage = Object.values(errorData).flat()[0];
        toast.error(String(errorMessage) || "Failed to save employee.", {
          id: toastId,
        });
      }
    } catch {
      toast.error("Server connection failed.", { id: toastId });
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-8 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
        Onboard New Employee
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* --- LOGIN CREDENTIALS SECTION --- */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            1. System Login Credentials
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-md border border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Temporary Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* --- HR DATA SECTION --- */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            2. HR Placement Data
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-md border border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={companyId}
                onChange={(e) => {
                  setCompanyId(e.target.value);
                  setDepartmentId(""); // <--- Resets the department instantly!
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Company...</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                disabled={!companyId}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white disabled:bg-gray-100 disabled:text-gray-400 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">
                  {companyId
                    ? "Select Department..."
                    : "Select a company first"}
                </option>
                {filteredDepartments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Job Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                System Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="HR">HR Manager</option>
                <option value="ADMIN">System Administrator</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hire Date
              </label>
              <input
                type="date"
                value={hireDate}
                onChange={(e) => setHireDate(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Home Address
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={() => navigate("/employees")}
            className="mr-4 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium shadow-sm transition-colors"
          >
            Complete Onboarding
          </button>
        </div>
      </form>
    </div>
  );
}
