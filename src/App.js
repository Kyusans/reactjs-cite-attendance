import { Toaster } from "sonner";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login";
import { FacultyDashboard } from "./pages/Faculty/FacultyDashboard";


function App() {


  return (
    <div className="text-white bg-zinc-800">
      <Toaster richColors position='top-right' duration={1500} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
