import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface Company {
  id: number;
  name: string;
}

export default function AddDepartment() {
  const [name, setName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      const token = localStorage.getItem("access");
      try {
        const res = await fetch("http://127.0.0.1:8000/api/companies/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setCompanies(await res.json());
      } catch {
        toast.error("Failed to load companies.");
      }
    };
    fetchCompanies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !companyId) return toast.error("Please fill in all fields.");

    const token = localStorage.getItem("access");
    const toastId = toast.loading("Saving department...");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/departments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, company: parseInt(companyId) }),
      });

      if (response.ok) {
        toast.success("Department created successfully!", { id: toastId });
        navigate("/departments");
      } else {
        // Catch the Django error
        const errorData = await response.json();
        // Extract the exact message
        const errorMessage = Object.values(errorData).flat()[0];
        // Pop the toast!
        toast.error(String(errorMessage) || "Failed to create department.", {
          id: toastId,
        });
      }
    } catch {
      toast.error("Server connection failed.", { id: toastId });
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow rounded-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
        Add Department
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Parent Company
          </label>
          <select
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
          >
            <option value="">Select a Company...</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Department Name
          </label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={() => navigate("/departments")}
            className="mr-4 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Save Department
          </button>
        </div>
      </form>
    </div>
  );
}
