import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/api.js";
import { AuthContext } from "../../context/AuthContext.jsx";

const TicketDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get(`/tickets/${id}`),
      api.get(`/tickets/${id}/comments`)
    ])
      .then(([ticketRes, commentsRes]) => {
        setTicket(ticketRes.data.ticket);
        setComments(commentsRes.data.comments);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load ticket");
        setLoading(false);
      });
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setActionError("");
    try {
      const res = await api.put(`/tickets/${id}`, { status: newStatus });
      setTicket(res.data.ticket);
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleReopen = async () => {
    setActionError("");
    try {
      const res = await api.put(`/tickets/${id}`, { status: "Open" });
      setTicket(res.data.ticket);
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to reopen ticket");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await api.post(`/tickets/${id}/comments`, { message: newComment });
      setComments([...comments, res.data.comment]);
      setNewComment("");
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to add comment");
    }
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading ticket...</div>;
  if (error) return <div style={{ padding: "2rem", color: "#b91c1c" }}>{error}</div>;
  if (!ticket) return null;

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <Link to={user?.role === "admin" ? "/admin/tickets" : "/tickets"}>
          &larr; Back to Tickets
        </Link>
      </div>

      {actionError && (
        <div style={{ padding: "0.75rem", backgroundColor: "#fee2e2", color: "#b91c1c", borderRadius: "4px", marginBottom: "1rem" }}>
          {actionError}
        </div>
      )}

      <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "1.5rem", backgroundColor: "#ffffff", marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
          <div>
            <span style={{ fontWeight: "bold", fontSize: "0.9rem", color: "#6b7280" }}>{ticket.ticketNumber}</span>
            <h2 style={{ margin: "0.25rem 0" }}>{ticket.title}</h2>
          </div>
          <span style={{
            padding: "0.3rem 0.6rem",
            borderRadius: "4px",
            backgroundColor: ticket.status === "Open" ? "#2563eb" : ticket.status === "In Progress" ? "#f59e0b" : "#10b981",
            color: "#ffffff",
            fontWeight: "bold",
            fontSize: "0.9rem"
          }}>
            {ticket.status}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.9rem", color: "#4b5563", marginBottom: "1rem" }}>
          <div><strong>Department:</strong> {ticket.department?.name || "General"}</div>
          <div><strong>Category:</strong> {ticket.category}</div>
          <div><strong>Priority:</strong> {ticket.priority}</div>
          <div><strong>Submitted by:</strong> {ticket.customer?.name} ({ticket.customer?.email})</div>
          <div><strong>Created:</strong> {new Date(ticket.createdAt).toLocaleDateString()}</div>
          {ticket.resolvedAt && (
            <div><strong>Resolved:</strong> {new Date(ticket.resolvedAt).toLocaleDateString()}</div>
          )}
        </div>

        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "1rem" }}>
          <h4 style={{ margin: "0 0 0.5rem 0" }}>Description</h4>
          <p style={{ whiteSpace: "pre-wrap", color: "#374151" }}>{ticket.description}</p>
        </div>

        {user?.role === "admin" && (
          <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #e5e7eb" }}>
            <label style={{ fontWeight: "bold", marginRight: "0.5rem" }}>Update Status:</label>
            <select
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              style={{ padding: "0.4rem", borderRadius: "4px", border: "1px solid #d1d5db" }}
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        )}

        {user?.role === "customer" && (ticket.status === "Resolved" || ticket.status === "Closed") && (
          <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #e5e7eb" }}>
            {ticket.reopenCount === 0 ? (
              <button
                onClick={handleReopen}
                style={{
                  backgroundColor: "#f59e0b",
                  color: "#ffffff",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "500"
                }}
              >
                Reopen Ticket
              </button>
            ) : (
              <span style={{ color: "#6b7280", fontStyle: "italic", fontSize: "0.9rem" }}>
                This ticket was already reopened once and cannot be reopened again.
              </span>
            )}
          </div>
        )}
      </div>

      <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "1.5rem", backgroundColor: "#ffffff" }}>
        <h3>Comments & Updates ({comments.length})</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", margin: "1rem 0" }}>
          {comments.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment._id}
                style={{
                  backgroundColor: comment.author?.role === "admin" ? "#f0fdf4" : "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  padding: "0.75rem"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem", fontSize: "0.85rem", color: "#6b7280" }}>
                  <strong>
                    {comment.author?.name} ({comment.author?.role})
                  </strong>
                  <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p style={{ margin: 0, color: "#374151" }}>{comment.message}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleAddComment} style={{ marginTop: "1.5rem" }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
            rows={3}
            placeholder="Write a reply or comment..."
            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #d1d5db", marginBottom: "0.5rem" }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            Post Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default TicketDetails;
