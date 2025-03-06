import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import AdminDashboard from "./pages/admin/AdminDashboard";
// import ManageAdmins from "./pages/superadmin/ManageAdmins";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import HrDashboard from "./pages/hr/HrDashboard";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import UserManagement from "./pages/admin/UserManagement";
import LeaveManagement from "./pages/hr/LeaveManagement";
import Profile from "./pages/employee/Profile";
import { Roleelements } from "./pages/superadmin/Roles/Roleelements";
import { Teamelement } from "./pages/superadmin/Teams/Teamelement";
import { Clientelements } from "./pages/superadmin/Clients/Clientelements";
import { Employeelayout } from "./pages/superadmin/employee/Employeelayout";
import { Projectelements } from "./pages/superadmin/Projects/Projectelements";
import { Projectelementsbd } from "./pages/bd/Projects/Projectelementsbd";
import { Clientelementsbd } from "./pages/bd/Clients/Clientelementsbd";
import { AuthProvider } from "./context/AuthContext";
import BDDashboard from "./pages/bd/BDDashboard";
import { BDTeamelement } from "./pages/bd/Teams/BDTeamelement";
import { Assignedelement } from "./pages/bd/Projects_assigned/Assignedelement";
const RoleBasedRoute = ({ element, allowedRoles }) => {
  // const { user } = useAuth();
  const user = localStorage.getItem("userData");
    
  // console.log("routes", user);
  if (!user) return <Navigate to="/" />;

  console.log("Logged-in User:", user);

  const userRole = localStorage.getItem("user_name");
  console.log("Extracted Role:", userRole);

  const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase().replace(/\s+/g, ""));

  return normalizedAllowedRoles.includes(userRole) ? element : <Navigate to="/" />;
};

const AppRoutes = () => {
  return (
    <AuthProvider>
    <div className="flex">

      <Sidebar />

 
      <div className="flex-1 w-full ml-72 py-2.5 px-4 overflow-hidden">
        <Routes>
          <Route
            path="/admin/dashboard"
            element={<RoleBasedRoute element={<AdminDashboard />} allowedRoles={["admin"]} />}
          />
          <Route
            path="/superadmin/dashboard"
            element={<RoleBasedRoute element={<SuperAdminDashboard />} allowedRoles={["superadmin"]} />}
          />
          <Route
            path="/superadmin/roles"
            element={<RoleBasedRoute element={<Roleelements />} allowedRoles={["superadmin"]} />}
          />
           <Route
            path="/superadmin/users"
            element={<RoleBasedRoute element={<Employeelayout />} allowedRoles={["superadmin"]} />}
          />
          <Route
            path="/superadmin/team"
            element={<RoleBasedRoute element={<Teamelement />} allowedRoles={["superadmin"]} />}
          />

          <Route
            path="/superadmin/clients"
            element={<RoleBasedRoute element={<Clientelements />} allowedRoles={["superadmin"]} />}
          />

          <Route
            path="/superadmin/projects"
            element={<RoleBasedRoute element={<Projectelements />} allowedRoles={["superadmin"]} />}
          />

          <Route
            path="/billingmanager/dashboard"
            element={<RoleBasedRoute element={<BDDashboard />} allowedRoles={["billingmanager"]} />}
          />

          <Route
            path="/billingmanager/projects"
            element={<RoleBasedRoute element={<Projectelementsbd />} allowedRoles={["billingmanager"]} />}
          />
          <Route
            path="/billingmanager/clients"
            element={<RoleBasedRoute element={<Clientelementsbd />} allowedRoles={["billingmanager"]} />}
          />

          <Route
            path="/billingmanager/teams"
            element={<RoleBasedRoute element={<BDTeamelement />} allowedRoles={["billingmanager"]} />}
          />


          <Route
            path="/billingmanager/projects-assigned"
            element={<RoleBasedRoute element={<Assignedelement />} allowedRoles={["billingmanager"]} />}
          />
          
              <Route
            path="/hr/dashboard"
            element={<RoleBasedRoute element={<HrDashboard />} allowedRoles={["hr"]} />}
          />
          <Route
            path="/employee/dashboard"
            element={<RoleBasedRoute element={<EmployeeDashboard />} allowedRoles={["employee"]} />}
          />
          <Route
            path="/admin/users"
            element={<RoleBasedRoute element={<UserManagement />} allowedRoles={["admin"]} />}
          />
          <Route
            path="/hr/leaves"
            element={<RoleBasedRoute element={<LeaveManagement />} allowedRoles={["hr"]} />}
          />
          <Route
            path="/employee/profile"
            element={<RoleBasedRoute element={<Profile />} allowedRoles={["employee"]} />}
          />
        </Routes>
      </div>
    </div>
    </AuthProvider>
  );
};
export default AppRoutes;
