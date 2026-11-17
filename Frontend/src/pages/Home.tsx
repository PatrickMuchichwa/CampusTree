import { ArrowRight, BookOpen, Laptop, Shirt, Home as HomeIcon, ShieldCheck, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../components/products/ProductCard";
import { useApp } from "../context/AppContext";

const categoryItems = [
  { name: "Books", icon: BookOpen, count: "Textbooks & notes" },
  { name: "Electronics", icon: Laptop, count: "Gadgets & accessories" },
  { name: "Fashion", icon: Shirt, count: "Clothing & style" },
  { name: "Home & Living", icon: HomeIcon, count: "Room essentials" }
];

export default function Home() {
  const { products } = useApp();
  return (
    <>
      <section className="hero-section">
        <div className="container hero-content">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-dot" /> THE STUDENT MARKETPLACE</span>
            <h1>Find it. Sell it.<br /><span>Make campus life easier.</span></h1>
            <p>Buy and sell with students around you. Discover affordable textbooks, electronics, fashion and everyday essentials in one place.</p>
            <div className="hero-actions"><Link to="/marketplace" className="button button-primary button-large">Explore marketplace <ArrowRight size={18} /></Link><Link to="/register" className="button button-white button-large">Join the community</Link></div>
            <div className="hero-trust"><span><ShieldCheck size={16} /> Student-focused community</span><span><Users size={16} /> Buy and sell locally</span></div>
          </div>
          <div className="hero-visual">
            <div className="hero-photo-main"><img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1100" alt="Students studying together on campus" /></div>
            <div className="floating-note"><span className="floating-icon"><Zap size={18} /></span><div><strong>Good finds, closer to you</strong><small>Discover your campus deals</small></div></div>
            <div className="hero-circle circle-one"></div><div className="hero-circle circle-two"></div>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading"><div><span className="eyebrow">BROWSE BY CATEGORY</span><h2>What are you looking for?</h2><p>Explore popular student essentials.</p></div><Link to="/marketplace" className="text-link">View all categories <ArrowRight size={16} /></Link></div>
        <div className="category-grid">
          {categoryItems.map(({ name, icon: Icon, count }) => <Link to={`/marketplace?category=${encodeURIComponent(name)}`} className="category-card" key={name}><span className="category-icon"><Icon size={24} /></span><strong>{name}</strong><small>{count}</small><ArrowRight className="category-arrow" size={17} /></Link>)}
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">FRESH FINDS</span><h2>Recently listed</h2><p>Take a look at what's new in the marketplace.</p></div><Link to="/marketplace" className="text-link">Browse all products <ArrowRight size={16} /></Link></div>
          <div className="product-grid">{products.slice(0, 4).map(product => <ProductCard key={product.id} product={product} />)}</div>
        </div>
      </section>

      <section className="section container">
        <div className="sell-banner"><div><span className="eyebrow eyebrow-light">HAVE SOMETHING TO SELL?</span><h2>Turn your unused items into someone else's next favourite find.</h2><p>List your products and connect with students in your community.</p><Link to="/sell" className="button button-white button-large">Start selling <ArrowRight size={17} /></Link></div><div className="sell-banner-art"><ShoppingBagArt /></div></div>
      </section>
    </>
  );
}

function ShoppingBagArt() {
  return <div className="bag-art"><div className="bag-handle"></div><div className="bag-leaf"><span></span><span></span></div></div>;
}
