import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleRegister = async () => {
    await API.post("/register", form);
    navigate("/");
  };

  return (
    <div className="page-center">
      <div className="glass-card">

        <h2>Register</h2>

        <input
          placeholder="Name"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button onClick={handleRegister}>Register</button>

        <p style={{ marginTop: "10px" }}>
          Already have an account?{" "}
          <span
            style={{ color: "#60a5fa", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}