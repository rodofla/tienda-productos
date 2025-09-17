// [EJERCICIO 2] Form + react-simple-validator
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRef, useState } from "react";
import SimpleReactValidator from "simple-react-validator";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { uploadImageToCloudinary } from "../lib/cloudinary";

export default function ProductForm() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", price: "", image: null });
  const [, forceUpdate] = useState();
  const [loading, setLoading] = useState(false);
  const validator = useRef(
    new SimpleReactValidator({
      messages: { required: "Obligatorio", numeric: "Debe ser numérico" },
    })
  );

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((f) => ({ ...f, [name]: files ? files[0] : value }));
    if (validator.current.messageShown(name)) forceUpdate({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Debes iniciar sesión para crear productos.");
    if (!validator.current.allValid()) {
      validator.current.showMessages();
      return forceUpdate({});
    }

    try {
      setLoading(true);
      let imageUrl = "";
      if (form.image) {
        imageUrl = await uploadImageToCloudinary(form.image);
      }
      await addDoc(collection(db, "products"), {
        name: form.name,
        price: Number(form.price),
        imageUrl,
        ownerUid: user.uid,
        createdAt: serverTimestamp(),
      });
      setForm({ name: "", price: "", image: null });
      alert("Producto creado");
    } catch (err) {
      alert(err.message || "Error al crear producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card p-3 shadow-sm" onSubmit={handleSubmit}>
      <h5 className="mb-3">Nuevo producto</h5>
      <div className="mb-2">
        <label className="form-label">Nombre</label>
        <input
          className="form-control"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <small className="text-danger">
          {validator.current.message("name", form.name, "required|alpha_space")}
        </small>
      </div>
      <div className="mb-2">
        <label className="form-label">Precio</label>
        <input
          className="form-control"
          name="price"
          value={form.price}
          onChange={handleChange}
        />
        <small className="text-danger">
          {validator.current.message("price", form.price, "required|numeric")}
        </small>
      </div>
      <div className="mb-3">
        <label className="form-label">Imagen (opcional)</label>
        <input
          type="file"
          accept="image/*"
          className="form-control"
          name="image"
          onChange={handleChange}
        />
      </div>
      <button className="btn btn-primary" disabled={loading}>
        {loading ? "Guardando…" : "Guardar"}
      </button>
    </form>
  );
}
