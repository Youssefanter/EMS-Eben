import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AddCompany() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return toast.error("Company name is required.");

    const token = localStorage.getItem("access");
    const toastId = toast.loading("Saving company...");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/companies/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, address }),
      });

      if (response.ok) {
        toast.success("Company created successfully!", { id: toastId });
        navigate("/dashboard");
      } else {
        const errorData = await response.json();

        const errorMessage = Object.values(errorData).flat()[0];

        toast.error(String(errorMessage) || "Failed to save company.", {
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
        Register New Company
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
            Save Company
          </button>
        </div>
      </form>
    </div>
  );
}
