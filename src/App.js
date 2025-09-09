import { Toaster } from "sonner";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { FacultyDashboard } from "./pages/Faculty/FacultyDashboard";
import { AdminDashboard } from "./pages/Admin/AdminDashboard";


function App() {


  return (
    <div>
      <Toaster richColors position='top-right' duration={1500} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
