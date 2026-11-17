import { Link } from "react-router-dom";
import { MapPin, ShoppingCart } from "lucide-react";
import type { Product } from "../../types";
import { useApp } from "../../context/AppContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useApp();
  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-image-wrap">
        <img src={product.image} alt={product.title} className="product-image" />
        <span className="condition-tag">{product.condition}</span>
      </Link>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <Link to={`/product/${product.id}`} className="product-title">{product.title}</Link>
        <div className="product-meta"><MapPin size={13} /> {product.university}</div>
        <div className="product-card-bottom">
          <strong className="product-price">R{product.price.toLocaleString("en-ZA")}</strong>
          <button className="add-cart-button" onClick={() => addToCart(product)} aria-label={`Add ${product.title} to cart`}><ShoppingCart size={17} /></button>
        </div>
      </div>
    </article>
  );
}
