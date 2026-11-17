import { ArrowLeft, MapPin, ShieldCheck, ShoppingCart, UserRound } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { products, addToCart } = useApp();
  const product = products.find(item => item.id === id);
  if (!product) return <main className="container page-section"><div className="empty-state"><h2>Product not found</h2><Link to="/marketplace" className="button button-primary">Back to marketplace</Link></div></main>;
  return (
    <main className="container page-section">
      <Link to="/marketplace" className="back-link"><ArrowLeft size={16} /> Back to marketplace</Link>
      <div className="details-layout">
        <div className="details-image"><img src={product.image} alt={product.title} /></div>
        <div className="details-copy">
          <span className="product-category">{product.category} · {product.condition}</span>
          <h1>{product.title}</h1><div className="details-price">R{product.price.toLocaleString("en-ZA")}</div>
          <p className="details-description">{product.description}</p>
          <div className="seller-box"><div className="seller-avatar"><UserRound size={21} /></div><div><strong>{product.sellerName}</strong><small>Seller · {product.university}</small></div><ShieldCheck className="verified-icon" size={20} /></div>
          <div className="detail-location"><MapPin size={17} /> Listed for students at {product.university}</div>
          <button className="button button-primary button-large full-width" onClick={() => addToCart(product)}><ShoppingCart size={18} /> Add to cart</button>
          <p className="safety-note">Always arrange a safe exchange and verify an item before completing a transaction.</p>
        </div>
      </div>
    </main>
  );
}
