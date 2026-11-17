import { Link } from "react-router-dom";
import { Package, Plus, ShoppingBag, Store, TrendingUp } from "lucide-react";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/products/ProductCard";

export default function Dashboard() {
  const { user, products, cart } = useApp();
  if (!user) return null;
  const myProducts = products.filter(product => product.sellerId === user.id);
  return <main className="container page-section"><div className="dashboard-welcome"><div><span className="eyebrow">YOUR CAMPUSTREE SPACE</span><h1>Hello, {user.name.split(" ")[0]} 👋</h1><p>Manage your marketplace activity and discover what's available.</p></div>{user.role === "seller" && <Link to="/sell" className="button button-primary"><Plus size={17} /> Add a listing</Link>}</div>
    <div className="stats-grid"><div className="stat-card"><span className="stat-icon"><Store /></span><div><small>Account type</small><strong>{user.role === "seller" ? "Seller" : "Buyer"}</strong></div></div><div className="stat-card"><span className="stat-icon"><Package /></span><div><small>Your listings</small><strong>{myProducts.length}</strong></div></div><div className="stat-card"><span className="stat-icon"><ShoppingBag /></span><div><small>Cart items</small><strong>{cart.reduce((sum, item) => sum + item.quantity, 0)}</strong></div></div><div className="stat-card"><span className="stat-icon"><TrendingUp /></span><div><small>University</small><strong className="university-stat">{user.university}</strong></div></div></div>
    <section className="dashboard-section"><div className="section-heading"><div><h2>{user.role === "seller" ? "Your listings" : "Recommended for you"}</h2><p>{user.role === "seller" ? "Products you have published." : "Explore products listed by other students."}</p></div>{user.role === "seller" && <Link to="/sell" className="text-link">Create listing <Plus size={16} /></Link>}</div>
      {user.role === "seller" && myProducts.length === 0 ? <div className="empty-state compact"><Package size={30} /><h3>You haven't listed anything yet</h3><p>Start selling by publishing your first product.</p><Link to="/sell" className="button button-primary">List a product</Link></div> : <div className="product-grid">{(user.role === "seller" ? myProducts : products.slice(0, 4)).map(product => <ProductCard key={product.id} product={product} />)}</div>}
    </section>
  </main>;
}
