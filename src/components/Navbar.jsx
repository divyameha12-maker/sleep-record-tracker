import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <span>🌙</span>
        <h2>SleepTracker</h2>
      </div>

      <div className="nav-links">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/records">Sleep Records</NavLink>
        <NavLink to="/summary">Weekly Summary</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;