import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const onLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-semibold" to="/">
          Tienda de Productos
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
          aria-controls="nav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Inicio
              </NavLink>
            </li>
            {user && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin">
                  Admin
                </NavLink>
              </li>
            )}
            {user && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/mis-compras">
                  Mis compras
                </NavLink>
              </li>
            )}
            {!user ? (
              <li className="nav-item ms-lg-2">
                <Link className="btn btn-light btn-sm" to="/auth">
                  Entrar / Registrarse
                </Link>
              </li>
            ) : (
              <li className="nav-item ms-lg-3 d-flex align-items-center gap-2">
                <span className="text-white-50 small">{user.email}</span>
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={onLogout}
                >
                  Salir
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
