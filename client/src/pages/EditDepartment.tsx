import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

interface Company {
  id: number;
  name: string;
}

export default function EditDepartment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch both the companies list AND the specific department data
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access");
      try {
        // 1. Get Companies for the dropdown
        const compRes = await fetch("http://127.0.0.1:8000/api/companies/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (compRes.ok) setCompanies(await compRes.json());

        // 2. Get the specific Department data
        const deptRes = await fetch(
          `http://127.0.0.1:8000/api/departments/${id}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (deptRes.ok) {
          const data = await deptRes.json();
          setName(data.name);
          setCompanyId(data.company.toString());
        } else {
          toast.error("Department not found.");
          navigate("/departments");
        }
      } catch {
        toast.error("Failed to load department data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !companyId) return toast.error("Please fill in all fields.");

    const token = localStorage.getItem("access");
    const toastId = toast.loading("Updating department...");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/departments/${id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, company: parseInt(companyId) }),
        },
      );

      if (response.ok) {
        toast.success("Department updated successfully!", { id: toastId });
        navigate("/departments");
      } else {
        const errorData = await response.json();
        const errorMessage = Object.values(errorData).flat()[0];
        toast.error(String(errorMessage) || "Failed to update department.", {
          id: toastId,
        });
      }
    } catch {
      toast.error("Server connection failed.", { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center text-gray-500 animate-pulse">
        Loading data...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white shadow rounded-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
        Edit Department
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
            Update Department
          </button>
        </div>
      </form>
    </div>
  );
}
