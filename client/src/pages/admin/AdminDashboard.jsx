import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api.js";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/tickets")
      .then((res) => {
        const tickets = res.data.tickets;
        setStats({
          total: tickets.length,
          open: tickets.filter((t) => t.status === "Open").length,
          inProgress: tickets.filter((t) => t.status === "In Progress").length,
          resolved: tickets.filter((t) => t.status === "Resolved").length,
          closed: tickets.filter((t) => t.status === "Closed").length
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "0 1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2>Admin Helpdesk Dashboard</h2>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link to="/admin/tickets" style={{ backgroundColor: "#2563eb", color: "#ffffff", padding: "0.5rem 1rem", borderRadius: "4px", textDecoration: "none" }}>
            View All Tickets
          </Link>
          <Link to="/admin/departments" style={{ backgroundColor: "#4b5563", color: "#ffffff", padding: "0.5rem 1rem", borderRadius: "4px", textDecoration: "none" }}>
            Manage Departments
          </Link>
        </div>
      </div>

      {loading ? (
        <p>Loading metrics...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <div style={{ padding: "1.25rem", borderRadius: "8px", backgroundColor: "#ffffff", border: "1px solid #e5e7eb", textAlign: "center" }}>
            <h4 style={{ margin: "0 0 0.5rem 0", color: "#6b7280" }}>Total Tickets</h4>
            <span style={{ fontSize: "2rem", fontWeight: "bold", color: "#111827" }}>{stats.total}</span>
          </div>

          <div style={{ padding: "1.25rem", borderRadius: "8px", backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", textAlign: "center" }}>
            <h4 style={{ margin: "0 0 0.5rem 0", color: "#1d4ed8" }}>Open</h4>
            <span style={{ fontSize: "2rem", fontWeight: "bold", color: "#1d4ed8" }}>{stats.open}</span>
          </div>

          <div style={{ padding: "1.25rem", borderRadius: "8px", backgroundColor: "#fffbeb", border: "1px solid #fde68a", textAlign: "center" }}>
            <h4 style={{ margin: "0 0 0.5rem 0", color: "#b45309" }}>In Progress</h4>
            <span style={{ fontSize: "2rem", fontWeight: "bold", color: "#b45309" }}>{stats.inProgress}</span>
          </div>

          <div style={{ padding: "1.25rem", borderRadius: "8px", backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0", textAlign: "center" }}>
            <h4 style={{ margin: "0 0 0.5rem 0", color: "#047857" }}>Resolved</h4>
            <span style={{ fontSize: "2rem", fontWeight: "bold", color: "#047857" }}>{stats.resolved}</span>
          </div>

          <div style={{ padding: "1.25rem", borderRadius: "8px", backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb", textAlign: "center" }}>
            <h4 style={{ margin: "0 0 0.5rem 0", color: "#4b5563" }}>Closed</h4>
            <span style={{ fontSize: "2rem", fontWeight: "bold", color: "#4b5563" }}>{stats.closed}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
