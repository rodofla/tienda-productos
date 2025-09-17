import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      if (mode === "login") await login(email, password);
      else await register(email, password);
      navigate("/");
    } catch (error) {
      setErr(error.message || "Error de autenticación");
    }
  };

  return (
    <div
      className="container d-flex align-items-center justify-content-center"
      style={{ minHeight: "70vh" }}
    >
      <div className="card shadow-sm w-100" style={{ maxWidth: 420 }}>
        <div className="card-body p-4">
          <h3 className="mb-3">
            {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </h3>
          <form onSubmit={onSubmit} className="vstack gap-3">
            <div>
              <label className="form-label">Email</label>
              <input
                className="form-control"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Contraseña</label>
              <input
                className="form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {err && <div className="alert alert-danger py-2">{err}</div>}
            <div className="d-flex gap-2">
              <button className="btn btn-primary" type="submit">
                {mode === "login" ? "Entrar" : "Registrarse"}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
              >
                {mode === "login" ? "Crear cuenta" : "Ya tengo cuenta"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
