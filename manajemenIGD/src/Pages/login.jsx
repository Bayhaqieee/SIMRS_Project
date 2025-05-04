import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // <--- untuk redirect

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "123456") {
      setError("");
      navigate("/dashboard"); // <--- redirect ke dashboard
    } else {
      setError("Username atau password salah!");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="left-side">
          <div className="left-circle">
            <div className="circle-text">
              <div className="line-1">MANAJEMEN</div>
              <div className="line-2">INSTALASI GAWAT DARURAT</div>
              <div className="line-3">(IGD)</div>
            </div>
          </div>
        </div>
        <div className="right-side">
          <div className="login-box">
            <form onSubmit={handleLogin}>
              <h3>LOGIN</h3>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="error-message">{error}</p>}
              <button type="submit">Masuk</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
