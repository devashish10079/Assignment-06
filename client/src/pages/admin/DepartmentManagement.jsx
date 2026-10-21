import { useState, useEffect } from "react";
import api from "../../api/api.js";

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/departments")
      .then((res) => {
        setDepartments(res.data.departments);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load departments");
        setLoading(false);
      });
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/departments", { name, description });
      setDepartments([...departments, res.data.department]);
      setName("");
      setDescription("");
      setSuccess("Department added successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add department");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}>
      <h2>Department Management</h2>

      {error && (
        <div style={{ padding: "0.75rem", backgroundColor: "#fee2e2", color: "#b91c1c", borderRadius: "4px", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ padding: "0.75rem", backgroundColor: "#d1fae5", color: "#065f46", borderRadius: "4px", marginBottom: "1rem" }}>
          {success}
        </div>
      )}

      <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "1.5rem", backgroundColor: "#ffffff", marginBottom: "2rem" }}>
        <h3>Add New Department</h3>
        <form onSubmit={handleCreate}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500" }}>Department Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. IT Support, HR, Facilities"
              style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #d1d5db" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500" }}>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of responsibilities"
              style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #d1d5db" }}
            />
          </div>
          <button
            type="submit"
            style={{ backgroundColor: "#2563eb", color: "#ffffff", border: "none", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer", fontWeight: "500" }}
          >
            Create Department
          </button>
        </form>
      </div>

      <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "1.5rem", backgroundColor: "#ffffff" }}>
        <h3>Existing Departments ({departments.length})</h3>
        {loading ? (
          <p>Loading departments...</p>
        ) : departments.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No departments created yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
            {departments.map((dept) => (
              <div
                key={dept._id}
                style={{
                  border: "1px solid #f3f4f6",
                  padding: "0.75rem",
                  borderRadius: "4px",
                  backgroundColor: "#f9fafb"
                }}
              >
                <div style={{ fontWeight: "bold", color: "#1f2937" }}>{dept.name}</div>
                <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>{dept.description || "No description"}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentManagement;
