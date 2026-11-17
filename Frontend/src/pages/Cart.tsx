import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart } = useApp();
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return <main className="container page-section"><div className="page-heading"><span className="eyebrow">YOUR SHOPPING</span><h1>Shopping cart</h1><p>Review the items you've added.</p></div>
    {cart.length === 0 ? <div className="empty-state"><ShoppingBag size={34} /><h2>Your cart is empty</h2><p>Explore the marketplace and find something useful.</p><Link to="/marketplace" className="button button-primary">Explore marketplace</Link></div> :
      <div className="cart-layout"><section className="cart-items">{cart.map(item => <article className="cart-item" key={item.product.id}><img src={item.product.image} alt={item.product.title} /><div className="cart-item-info"><Link to={`/product/${item.product.id}`}><strong>{item.product.title}</strong></Link><small>{item.product.category}</small><strong>R{item.product.price.toLocaleString("en-ZA")}</strong></div><div className="quantity-control"><button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} disabled={item.quantity <= 1} aria-label="Decrease quantity"><Minus size={14} /></button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} aria-label="Increase quantity"><Plus size={14} /></button></div><button className="remove-button" onClick={() => removeFromCart(item.product.id)} aria-label="Remove item"><Trash2 size={17} /></button></article>)}</section>
      <aside className="order-summary"><h3>Order summary</h3><div><span>Subtotal</span><strong>R{total.toLocaleString("en-ZA")}</strong></div><div><span>Delivery</span><span>Arrange with seller</span></div><hr /><div className="summary-total"><strong>Total</strong><strong>R{total.toLocaleString("en-ZA")}</strong></div><button className="button button-primary button-large full-width" onClick={() => alert("Checkout will be connected to the CampusTree backend and payment provider.")}>Continue to checkout</button><p>Payments and order processing are not enabled in this frontend prototype.</p></aside></div>}
  </main>;
}
