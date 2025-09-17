import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../firebase";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "products", id));
        if (alive)
          setProduct(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) return <div className="container py-4">Cargando…</div>;
  if (!product)
    return (
      <div className="container py-4">
        <div className="alert alert-warning">Producto no encontrado.</div>
        <Link className="btn btn-outline-secondary" to="/">
          Volver
        </Link>
      </div>
    );

  return (
    <div className="container py-4">
      <Link to="/" className="text-decoration-none">
        &larr; Volver
      </Link>
      <div className="row g-4 mt-1">
        <div className="col-md-6">
          <img
            src={
              product.imageUrl ||
              "https://via.placeholder.com/800x600?text=Sin+imagen"
            }
            alt={product.name}
            className="img-fluid rounded shadow-sm"
          />
        </div>
        <div className="col-md-6">
          <h2 className="fw-semibold">{product.name}</h2>
          <p className="fs-3 fw-bold mt-2">${product.price}</p>
          <p className="text-secondary">Producto de la tienda</p>
        </div>
      </div>
    </div>
  );
}
