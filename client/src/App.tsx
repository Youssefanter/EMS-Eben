import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import AddEmployee from "./pages/AddEmployee";
import Profile from "./pages/Profile";
import { Toaster } from "react-hot-toast";
import AddCompany from "./pages/AddCompany";
import AddDepartment from "./pages/AddDepartment";
import EditCompany from "./pages/EditCompany";
import EditDepartment from "./pages/EditDepartment";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/companies"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <Layout>
                <Employees />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/departments"
          element={
            <ProtectedRoute>
              <Layout>
                <Departments />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees/add"
          element={
            <ProtectedRoute>
              <Layout>
                <AddEmployee />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/companies/add"
          element={
            <ProtectedRoute>
              <Layout>
                <AddCompany />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/departments/add"
          element={
            <ProtectedRoute>
              <Layout>
                <AddDepartment />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/companies/edit/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <EditCompany />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/departments/edit/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <EditDepartment />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
