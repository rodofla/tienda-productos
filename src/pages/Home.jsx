import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import CartClass from "../components/CartClass";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const cartRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => setErrMsg(err.message)
    );
    return () => unsub();
  }, []);

  const onAddToCart = (p) => cartRef.current?.addItem(p);
  const onCheckout = async (items, total) => {
    if (!user) return alert("Inicia sesión para comprar.");
    await addDoc(collection(db, "orders"), {
      userUid: user.uid,
      items,
      total,
      createdAt: serverTimestamp(),
    });
    alert('Compra registrada (simulada). Revisa "Mis compras".');
  };

  return (
    <div className="container">
      <div className="hero">
        <h1 className="display-5 fw-semibold">Tienda de Productos</h1>
        <p className="text-secondary">
          Explora, agrega al carrito y compra (simulado).
        </p>
      </div>

      {errMsg && (
        <div className="alert alert-warning">
          No se pudo cargar productos: {errMsg}
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {products.map((p) => (
              <div key={p.id} className="col">
                <ProductCard product={p} onAddToCart={onAddToCart} />
              </div>
            ))}
          </div>
        </div>
        <div className="col-lg-4">
          <div className="cart-sticky">
            <CartClass ref={cartRef} onCheckout={onCheckout} />
          </div>
        </div>
      </div>
    </div>
  );
}
