import { Toaster } from "sonner";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login";


function App() {


  return (
    <div className="text-white bg-zinc-800">
      <Toaster richColors position='top-right' duration={1500} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
