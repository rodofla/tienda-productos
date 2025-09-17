import ProductForm from "../components/ProductForm";
import { useAuth } from "../context/AuthContext";

export default function AdminProducts() {
  const { user } = useAuth();
  if (!user)
    return (
      <div className="container py-4">
        <div className="alert alert-info">Necesitas iniciar sesión.</div>
      </div>
    );
  return (
    <div className="container py-3">
      <h2 className="mb-3">Administrar productos</h2>
      <div className="row g-3">
        <div className="col-lg-6">
          <ProductForm />
        </div>
        <div className="col-lg-6">
          <div className="alert alert-secondary">
            Sube una imagen y completa nombre y precio. Solo estilos fueron
            mejorados.
          </div>
        </div>
      </div>
    </div>
  );
}
