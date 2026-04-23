import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await API.post("/login", { email, password });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("name", res.data.name); // NEW

    navigate("/dashboard");
  };

  return (
    <div className="page-center">
    <div className="glass-card">

      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>

      <p style={{ marginTop: "10px" }}>
        Don’t have an account?{" "}
        <span
          style={{ color: "#60a5fa", cursor: "pointer" }}
          onClick={() => navigate("/register")}
        >
          Register
        </span>
      </p>

    </div>
  </div>

  );
}