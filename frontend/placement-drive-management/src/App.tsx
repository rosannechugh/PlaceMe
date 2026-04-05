import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import ApplicationStatus from "./pages/ApplicationStatus";
import AdminDashboard from "./pages/AdminDashboard";
import AddCompany from "./pages/AddCompany";
import CreateDrive from "./pages/CreateDrive";
import ViewApplications from "./pages/ViewApplications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student */}
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/applications" element={<ApplicationStatus />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/add-company" element={<AddCompany />} />
          <Route path="/admin/create-drive" element={<CreateDrive />} />
          <Route path="/admin/view-applications" element={<ViewApplications />} />

          {/* Catch */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;