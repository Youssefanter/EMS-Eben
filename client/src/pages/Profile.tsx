import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ProfileData {
  id: number;
  full_name: string;
  user_email: string;
  company_name: string;
  department_name: string | null;
  mobile: string;
  title: string;
  hire_date: string;
  role: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    if (!token) {
      navigate("/");
      return;
    }

    const fetchProfile = async () => {
      // FIX: ONLY the Master Admin skips the fetch. HR Managers need to fetch their profile!
      if (userRole === "ADMIN") {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/employees/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          // We filter by the logged in user's email just to be 100% sure we grab their specific profile
          // Since HR can see everyone in their company, data[0] might accidentally grab someone else!
          let myProfile = data[0];
          if (token) {
            const payloadEmail = JSON.parse(atob(token.split(".")[1])).email;
            const found = data.find(
              (emp: ProfileData) => emp.user_email === payloadEmail,
            );
            if (found) myProfile = found;
          }
          if (data.length > 0) setProfile(myProfile);
        }
      } catch {
        console.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, token, userRole]);

  const calculateDaysEmployed = (hireDate: string) => {
    if (!hireDate) return "N/A";
    const start = new Date(hireDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - start.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 animate-pulse">
        Loading profile...
      </div>
    );
  }

  // --- VIEW 1: SUPER USER (ADMIN ONLY) PROFILE ---
  // FIX: This now strictly requires the "ADMIN" role.
  if (userRole === "ADMIN") {
    return (
      <div className="max-w-3xl mx-auto bg-white shadow rounded-lg overflow-hidden mt-8 border border-gray-200">
        <div className="bg-slate-800 p-6 text-white">
          <h2 className="text-3xl font-bold">System Administrator</h2>
          <p className="text-slate-300 mt-1 text-lg">Master Access Level</p>
        </div>
        <div className="p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">
            System Privileges
          </h3>
          <div className="space-y-3">
            <p className="text-gray-900">
              <span className="font-medium bg-slate-100 px-2 py-1 rounded text-slate-700 mr-2">
                Role:
              </span>
              {userRole}
            </p>
            <p className="text-gray-900">
              <span className="font-medium bg-slate-100 px-2 py-1 rounded text-slate-700 mr-2">
                Access:
              </span>
              Full Read/Write/Delete permissions across all Companies,
              Departments, and Employee records.
            </p>
            <p className="text-gray-900">
              <span className="font-medium bg-slate-100 px-2 py-1 rounded text-slate-700 mr-2">
                Status:
              </span>
              <span className="text-green-600 font-bold">Active</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW 2: STANDARD EMPLOYEE & HR MANAGER PROFILE ---
  if (!profile) {
    return (
      <div className="p-8 text-center text-gray-500">
        No employee profile found for this account.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded-lg overflow-hidden mt-8">
      <div className="bg-blue-600 p-6 text-white">
        <h2 className="text-3xl font-bold">
          {profile.full_name || "Employee"}
        </h2>
        <p className="text-blue-100 mt-1 text-lg">
          {profile.title || "No Title Assigned"}
        </p>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Organization
          </h3>
          <p className="text-gray-900 mb-2">
            <span className="font-medium">Company:</span> {profile.company_name}
          </p>
          <p className="text-gray-900 mb-2">
            <span className="font-medium">Department:</span>{" "}
            {profile.department_name || "Unassigned"}
          </p>
          <p className="text-gray-900">
            <span className="font-medium">Role:</span> {profile.role}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Contact & Details
          </h3>
          <p className="text-gray-900 mb-2">
            <span className="font-medium">Email:</span>{" "}
            {profile.user_email || "N/A"}
          </p>
          <p className="text-gray-900 mb-2">
            <span className="font-medium">Mobile:</span>{" "}
            {profile.mobile || "N/A"}
          </p>
          <p className="text-gray-900 mb-2">
            <span className="font-medium">Hire Date:</span>{" "}
            {profile.hire_date || "N/A"}
          </p>
          <p className="text-sm text-gray-900 mt-2">
            <span className="font-semibold text-gray-700">Days Employed: </span>
            {calculateDaysEmployed(profile.hire_date)} Days
          </p>
        </div>
      </div>
    </div>
  );
}
