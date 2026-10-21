import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 2rem",
      backgroundColor: "#1f2937",
      color: "#f9fafb"
    }}>
      <div style={{ fontWeight: "bold", fontSize: "1.25rem" }}>
        <Link to="/" style={{ color: "#ffffff", textDecoration: "none" }}>
          Helpdesk System
        </Link>
      </div>
      <nav style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {user ? (
          <>
            {user.role === "admin" ? (
              <>
                <Link to="/admin/dashboard" style={{ color: "#e5e7eb" }}>Dashboard</Link>
                <Link to="/admin/tickets" style={{ color: "#e5e7eb" }}>All Tickets</Link>
                <Link to="/admin/departments" style={{ color: "#e5e7eb" }}>Departments</Link>
              </>
            ) : (
              <>
                <Link to="/tickets" style={{ color: "#e5e7eb" }}>My Tickets</Link>
                <Link to="/tickets/create" style={{ color: "#e5e7eb" }}>New Ticket</Link>
              </>
            )}
            <span style={{ color: "#9ca3af", marginLeft: "0.5rem" }}>
              {user.name} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#ef4444",
                color: "#ffffff",
                border: "none",
                padding: "0.4rem 0.8rem",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: "#60a5fa" }}>Login</Link>
            <Link to="/register" style={{ color: "#60a5fa" }}>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
