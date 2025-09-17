// [EJ1] Hijo con props + evento
export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="card h-100 border-0 shadow-sm card-hover">
      <div className="p-2">
        <img
          src={
            product.imageUrl ||
            "https://via.placeholder.com/600x400?text=Sin+imagen"
          }
          alt={product.name}
          className="product-img"
          loading="lazy"
        />
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="fw-semibold">{product.name}</h5>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="price">${product.price}</span>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => onAddToCart(product)}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
