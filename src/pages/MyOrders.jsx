// src/pages/MyOrders.jsx
// [EJERCICIO 3] Ver compras del usuario con mejor UI (solo estilos)
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";

const fmt = new Intl.NumberFormat("es-CL");
const fmtDate = (d) =>
  d
    ? d.toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short" })
    : "Sin fecha";

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const q = query(collection(db, "orders"), where("userUid", "==", user.uid));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => {
          const data = d.data();
          const createdAt = data.createdAt?.toDate?.() ?? null;
          return { id: d.id, ...data, createdAt };
        });
        // orden solo en cliente (evita pedir índices nuevos)
        rows.sort(
          (a, b) =>
            (b.createdAt?.getTime?.() ?? 0) - (a.createdAt?.getTime?.() ?? 0)
        );
        setOrders(rows);
        setLoading(false);
      },
      (_err) => setLoading(false)
    );
    return () => unsub();
  }, [user]);

  if (!user) {
    return (
      <div className="container py-4">
        <div className="alert alert-info">
          Debes iniciar sesión para ver tus compras.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center mb-3">
        <h2 className="me-3 mb-0">Mis compras</h2>
        <span className="badge text-bg-secondary">{orders.length}</span>
      </div>

      {loading && (
        <div className="vstack gap-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <span className="placeholder col-3"></span>
              <div className="mt-2">
                <span className="placeholder col-8"></span>
              </div>
            </div>
          </div>
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <span className="placeholder col-2"></span>
              <div className="mt-2">
                <span className="placeholder col-6"></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && orders.length === 0 && (
        <div className="alert alert-secondary">
          Aún no tienes compras registradas.
        </div>
      )}

      <div className="row g-3">
        {orders.map((o) => (
          <div key={o.id} className="col-12">
            <div className="card border-0 shadow-sm card-hover">
              <div className="card-body">
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <span className="badge text-bg-primary">
                    Orden #{o.id.slice(-6)}
                  </span>
                  <small className="text-secondary ms-auto">
                    {fmtDate(o.createdAt)}
                  </small>
                </div>

                <ul className="list-group list-group-flush mt-3">
                  {o.items?.map((it, i) => (
                    <li
                      key={i}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <div className="fw-semibold">{it.name}</div>
                        <small className="text-secondary">x{it.qty}</small>
                      </div>
                      <div className="fw-semibold">
                        ${fmt.format((it.price ?? 0) * (it.qty ?? 0))}
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="d-flex align-items-center mt-3">
                  <span className="text-secondary">Total</span>
                  <span className="fs-5 fw-bold ms-auto">
                    ${fmt.format(o.total ?? 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
