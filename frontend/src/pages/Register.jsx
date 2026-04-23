import { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleRegister = async () => {
    await API.post("/register", form);
    navigate("/");
  };

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input placeholder="password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}