import { useEffect, useState } from "react";
import API from "../../services/api";

export default function Dashboard() {
  const [grievances, setGrievances] = useState([]);
  const [form, setForm] = useState({});

  const fetchData = async () => {
    const res = await API.get("/grievances");
    setGrievances(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submitGrievance = async () => {
    await API.post("/grievances", form);
    fetchData();
  };

  const deleteGrievance = async (id) => {
    await API.delete(`/grievances/${id}`);
    fetchData();
  };

  return (
    <div>
      <h2>Dashboard</h2>

      <input placeholder="title" onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <input placeholder="description" onChange={(e) => setForm({ ...form, description: e.target.value })} />

      <button onClick={submitGrievance}>Submit</button>

      <hr />

      {grievances.map((g) => (
        <div key={g._id}>
          <h4>{g.title}</h4>
          <p>{g.description}</p>
          <button onClick={() => deleteGrievance(g._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}