import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import SleepRecords from "./pages/SleepRecords";
import WeeklySummary from "./pages/WeeklySummary";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/records" element={<SleepRecords />} />
            <Route path="/summary" element={<WeeklySummary />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;