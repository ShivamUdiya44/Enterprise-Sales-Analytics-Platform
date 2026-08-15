import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProfitLoss from "./pages/ProfitLoss";
import Employees from "./pages/Employees";
import Hiring from "./pages/Hiring";
import Upload from "./pages/Upload";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pnl" element={<ProfitLoss />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/hiring" element={<Hiring />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
