import React, { useState } from "react";
import "./App.css";

// PUBLIC_INTERFACE
export function AuthForms({ onAuth, mode = "login", onSwitch }) {
  // mode: "login" or "register"
  const [activeTab, setActiveTab] = useState(mode);
  return (
    <div style={{
      background: "var(--primary)",
      border: "1px solid var(--border-color)",
      borderRadius: 10,
      maxWidth: 340,
      margin: "36px auto 0 auto",
      boxShadow: "0 2px 24px 0 rgba(16,24,32,0.12)",
      padding: "30px 28px"
    }}>
      <div style={{
        display: "flex",
        gap: 0,
        marginBottom: 24,
        borderRadius: 6,
        overflow: "hidden",
        border: "1px solid var(--border-color)"
      }}>
        <button
          className={"btn"}
          style={{
            background: activeTab === "login" ? "var(--accent)" : "var(--secondary)",
            flex: 1,
            fontWeight: activeTab === "login" ? 700 : 500,
            border: "none",
            borderRadius: 0
          }}
          onClick={() => setActiveTab("login")}
        >
          Login
        </button>
        <button
          className={"btn"}
          style={{
            background: activeTab === "register" ? "var(--accent)" : "var(--secondary)",
            flex: 1,
            fontWeight: activeTab === "register" ? 700 : 500,
            border: "none",
            borderRadius: 0
          }}
          onClick={() => setActiveTab("register")}
        >
          Register
        </button>
      </div>
      {activeTab === "login"
        ? <LoginForm onAuth={onAuth} />
        : <RegisterForm onAuth={onAuth} />
      }
      <div style={{ marginTop: 10, textAlign: "center", color: "var(--text-secondary)", fontSize: 15 }}>
        {activeTab === "login" ? (
          <>
            Don't have an account?{" "}
            <span style={{ color: "var(--accent)", cursor: "pointer" }} onClick={() => setActiveTab("register")}>Register</span>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <span style={{ color: "var(--accent)", cursor: "pointer" }} onClick={() => setActiveTab("login")}>Login</span>
          </>
        )}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function LoginForm({ onAuth }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  // Simulate login validation
  function handleSubmit(e) {
    e.preventDefault();
    if (!form.username.trim() || !form.password) {
      setError("Both fields are required.");
      return;
    }
    setError("");
    // Demo: Accept any credentials, mark as logged in
    onAuth({ username: form.username });
  }
  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <label>
        <div style={{ color: "var(--text-secondary)", fontWeight: 500, marginBottom: 3 }}>Username</div>
        <input
          className="search-input"
          autoComplete="username"
          type="text"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          placeholder="Enter username"
        />
      </label>
      <label>
        <div style={{ color: "var(--text-secondary)", fontWeight: 500, marginBottom: 3 }}>Password</div>
        <input
          className="search-input"
          autoComplete="current-password"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          placeholder="Enter password"
        />
      </label>
      {error && (
        <div style={{ color: "#E87A41", marginBottom: -6, marginTop: -2, fontWeight: 500, fontSize: 14 }}>
          {error}
        </div>
      )}
      <button className="btn btn-large" style={{ width: "100%" }} type="submit">
        Login
      </button>
    </form>
  );
}

// PUBLIC_INTERFACE
function RegisterForm({ onAuth }) {
  const [form, setForm] = useState({ username: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  // Simulate signup validation
  function handleSubmit(e) {
    e.preventDefault();
    if (!form.username.trim() || !form.password || !form.confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }
    setError("");
    // Demo: Accept any credentials, mark as logged in
    onAuth({ username: form.username });
  }
  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <label>
        <div style={{ color: "var(--text-secondary)", fontWeight: 500, marginBottom: 3 }}>Username</div>
        <input
          className="search-input"
          autoComplete="username"
          type="text"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          placeholder="Choose a username"
        />
      </label>
      <label>
        <div style={{ color: "var(--text-secondary)", fontWeight: 500, marginBottom: 3 }}>Password</div>
        <input
          className="search-input"
          autoComplete="new-password"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          placeholder="Create a password"
        />
      </label>
      <label>
        <div style={{ color: "var(--text-secondary)", fontWeight: 500, marginBottom: 3 }}>Confirm Password</div>
        <input
          className="search-input"
          autoComplete="new-password"
          type="password"
          value={form.confirmPassword}
          onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
          placeholder="Repeat password"
        />
      </label>
      {error && (
        <div style={{ color: "#E87A41", marginBottom: -6, marginTop: -2, fontWeight: 500, fontSize: 14 }}>
          {error}
        </div>
      )}
      <button className="btn btn-large" style={{ width: "100%" }} type="submit">
        Register
      </button>
    </form>
  );
}
