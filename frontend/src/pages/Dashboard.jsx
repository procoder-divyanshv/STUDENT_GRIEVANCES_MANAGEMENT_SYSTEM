import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [grievances, setGrievances] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Academic",
  });
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // FETCH ALL
  const fetchData = async () => {
    const res = await API.get("/grievances");
    setGrievances(res.data);
  };

  const userName = localStorage.getItem("name");

  useEffect(() => {
    fetchData();
  }, []);

  // CREATE
  const submitGrievance = async () => {
    await API.post("/grievances", form);
    setForm({ title: "", description: "", category: "Academic" });
    fetchData();
  };

  // DELETE
  const deleteGrievance = async (id) => {
    await API.delete(`/grievances/${id}`);
    fetchData();
  };

  // UPDATE STATUS (simple toggle)
  const markResolved = async (id) => {
    await API.put(`/grievances/${id}`, {
      status: "Resolved",
    });
    fetchData();
  };

  // SEARCH
  const handleSearch = async () => {
    if (!search) return fetchData();
    const res = await API.get(`/grievances/search?title=${search}`);
    setGrievances(res.data);
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Student Grievance Dashboard</h2>
      <h2>Welcome, {userName}</h2>

      {/* LOGOUT */}
      <button onClick={logout}>Logout</button>

      <hr />

      {/* SEARCH */}
      <div>
        <input
          placeholder="Search grievance"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <hr />

      {/* SUBMIT FORM */}
      <h3>Submit Grievance</h3>

      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      <input
        placeholder="Description"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <select
        value={form.category}
        onChange={(e) =>
          setForm({ ...form, category: e.target.value })
        }
      >
        <option>Academic</option>
        <option>Hostel</option>
        <option>Transport</option>
        <option>Other</option>
      </select>

      <button onClick={submitGrievance}>Submit</button>

      <hr />

      {/* LIST */}
      <h3>All Grievances</h3>

      {grievances.map((g) => (
        <div
          key={g._id}
          style={{
            border: "1px solid black",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h4>{g.title}</h4>
          <p>{g.description}</p>

          <p>
            <b>Category:</b> {g.category}
          </p>

          <p>
            <b>Status:</b>{" "}
            <span
              style={{
                color:
                  g.status === "Resolved" ? "green" : "red",
              }}
            >
              {g.status}
            </span>
          </p>

          <button onClick={() => deleteGrievance(g._id)}>
            Delete
          </button>

          <button onClick={() => markResolved(g._id)}>
            Mark Resolved
          </button>
        </div>
      ))}
    </div>
  );
}