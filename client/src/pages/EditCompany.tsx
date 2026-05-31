import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function EditCompany() {
  const { id } = useParams(); // Grabs the company ID from the URL
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Fetch the existing company data when the page loads
  useEffect(() => {
    const fetchCompany = async () => {
      const token = localStorage.getItem("access");
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/companies/${id}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setName(data.name);
          setAddress(data.address || ""); // Handle null addresses gracefully
        } else {
          toast.error("Company not found.");
          navigate("/dashboard");
        }
      } catch {
        toast.error("Failed to load company details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id, navigate]);

  // 2. Handle the save button (Send a PUT request)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return toast.error("Company name is required.");

    const token = localStorage.getItem("access");
    const toastId = toast.loading("Updating company...");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/companies/${id}/`,
        {
          method: "PUT", // PUT tells Django to overwrite existing data
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, address }),
        },
      );

      if (response.ok) {
        toast.success("Company updated successfully!", { id: toastId });
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        const errorMessage = Object.values(errorData).flat()[0];
        toast.error(String(errorMessage) || "Failed to update company.", {
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
        Loading company details...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white shadow rounded-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
        Edit Company
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Company Name
          </label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Headquarters Address
          </label>
          <textarea
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mr-4 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Update Company
          </button>
        </div>
      </form>
    </div>
  );
}
