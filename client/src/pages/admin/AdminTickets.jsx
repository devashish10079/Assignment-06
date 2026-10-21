import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api.js";

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const url = statusFilter ? `/tickets?status=${statusFilter}` : "/tickets";
    api.get(url)
      .then((res) => {
        setTickets(res.data.tickets);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load tickets");
        setLoading(false);
      });
  }, [statusFilter]);

  const getStatusBadge = (status) => {
    const colors = {
      Open: "#2563eb",
      "In Progress": "#f59e0b",
      Resolved: "#10b981",
      Closed: "#6b7280"
    };
    return {
      backgroundColor: colors[status] || "#6b7280",
      color: "#ffffff",
      padding: "0.2rem 0.5rem",
      borderRadius: "4px",
      fontSize: "0.85rem",
      fontWeight: "bold"
    };
  };

  return (
    <div style={{ maxWidth: "950px", margin: "2rem auto", padding: "0 1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2>All Helpdesk Tickets</h2>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "0.4rem", borderRadius: "4px", border: "1px solid #d1d5db" }}
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {error && (
        <div style={{ padding: "0.75rem", backgroundColor: "#fee2e2", color: "#b91c1c", borderRadius: "4px", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading tickets...</p>
      ) : tickets.length === 0 ? (
        <p style={{ color: "#6b7280" }}>No tickets found matching the criteria.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "1rem",
                backgroundColor: "#ffffff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontWeight: "bold", color: "#374151" }}>{ticket.ticketNumber}</span>
                  <span style={getStatusBadge(ticket.status)}>{ticket.status}</span>
                  <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>[{ticket.priority}]</span>
                </div>
                <h3 style={{ margin: "0.25rem 0", fontSize: "1.1rem" }}>{ticket.title}</h3>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280" }}>
                  Customer: {ticket.customer?.name} ({ticket.customer?.email}) | Dept: {ticket.department?.name || "General"}
                </p>
              </div>
              <Link
                to={`/tickets/${ticket._id}`}
                style={{
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "4px",
                  textDecoration: "none",
                  fontWeight: "500"
                }}
              >
                Manage
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTickets;
