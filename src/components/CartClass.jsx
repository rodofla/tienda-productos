import { Component } from "react";

const fmt = new Intl.NumberFormat("es-CL");

export default class CartClass extends Component {
  state = { items: [] };
  componentDidMount() {}

  addItem = (p) => {
    const items = [...this.state.items];
    const i = items.findIndex((x) => x.id === p.id);
    if (i > -1) items[i].qty += 1;
    else items.push({ ...p, qty: 1 });
    this.setState({ items });
  };
  clear = () => this.setState({ items: [] });
  get total() {
    return this.state.items.reduce((s, i) => s + i.price * i.qty, 0);
  }

  render() {
    const { onCheckout } = this.props;
    const { items } = this.state;
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h5 className="mb-3">Carrito</h5>
          {items.length === 0 ? (
            <p className="text-secondary">No hay productos</p>
          ) : (
            <ul className="list-group list-group-flush mb-3">
              {items.map((it) => (
                <li
                  key={it.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>
                    {it.name} <span className="text-secondary">x{it.qty}</span>
                  </span>
                  <span className="fw-semibold">
                    ${fmt.format(it.price * it.qty)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="d-flex align-items-center">
            <span className="me-auto text-secondary">Total</span>
            <span className="fs-5 fw-bold">${fmt.format(this.total)}</span>
          </div>
          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-outline-secondary" onClick={this.clear}>
              Vaciar
            </button>
            <button
              className="btn btn-success ms-auto"
              onClick={() => onCheckout(items, this.total)}
            >
              Comprar
            </button>
          </div>
        </div>
      </div>
    );
  }
}
