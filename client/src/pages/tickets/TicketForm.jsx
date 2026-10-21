import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/api.js";

const TicketForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Technical");
  const [priority, setPriority] = useState("Medium");
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/departments")
      .then((res) => {
        setDepartments(res.data.departments);
        if (res.data.departments.length > 0) {
          setDepartment(res.data.departments[0]._id);
        }
      })
      .catch(() => {
        setError("Failed to load departments");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/tickets", {
        title,
        description,
        category,
        priority,
        department
      });
      navigate(`/tickets/${res.data.ticket._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "2rem", border: "1px solid #e5e7eb", borderRadius: "8px", background: "#ffffff" }}>
      <h2>Create Support Ticket</h2>
      {error && (
        <div style={{ padding: "0.75rem", marginBottom: "1rem", backgroundColor: "#fee2e2", color: "#b91c1c", borderRadius: "4px" }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500" }}>Ticket Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Brief summary of the issue"
            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #d1d5db" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500" }}>Department</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #d1d5db" }}
          >
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500" }}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #d1d5db" }}
            >
              <option value="Technical">Technical</option>
              <option value="Hardware">Hardware</option>
              <option value="Billing">Billing</option>
              <option value="Access">Access Issue</option>
              <option value="General">General Inquiry</option>
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500" }}>Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #d1d5db" }}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500" }}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            placeholder="Detailed description of your complaint or issue..."
            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #d1d5db" }}
          />
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            type="submit"
            disabled={loading}
            style={{ padding: "0.6rem 1.2rem", backgroundColor: "#2563eb", color: "#ffffff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "500" }}
          >
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>
          <Link
            to="/tickets"
            style={{ padding: "0.6rem 1.2rem", backgroundColor: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db", borderRadius: "4px", textDecoration: "none", display: "inline-block" }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default TicketForm;
