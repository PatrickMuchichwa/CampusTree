import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, ShoppingCart, UserRound, LogOut, Menu, X, Leaf } from "lucide-react";
import { useState } from "react";
import { useApp } from "../../context/AppContext";

export default function Navbar() {
  const { user, cart, logout } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const linkClass = ({ isActive }: { isActive: boolean }) => `nav-link ${isActive ? "active" : ""}`;

  const signOut = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="container nav-container">
        <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-icon"><Leaf size={23} /></span>
          <span>Campus<span className="brand-light">Tree</span></span>
        </Link>
        <button className="mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav className={`main-nav ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" className={linkClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/marketplace" className={linkClass} onClick={() => setMenuOpen(false)}>Marketplace</NavLink>
          <NavLink to="/sell" className={linkClass} onClick={() => setMenuOpen(false)}>Sell</NavLink>
          {user && <NavLink to="/dashboard" className={linkClass} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>}
        </nav>
        <div className={`nav-actions ${menuOpen ? "open" : ""}`}>
          <Link to="/cart" className="icon-link" aria-label="Shopping cart">
            <ShoppingCart size={20} /><span className="cart-count">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="user-chip"><UserRound size={17} /> {user.name.split(" ")[0]}</Link>
              <button className="button button-outline button-small" onClick={signOut}><LogOut size={15} /> Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-login">Log in</Link>
              <Link to="/register" className="button button-primary button-small"><ShoppingBag size={16} /> Join CampusTree</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
