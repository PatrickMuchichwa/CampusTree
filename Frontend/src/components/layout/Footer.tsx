import { Link } from "react-router-dom";
import { Leaf, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link to="/" className="brand footer-brand"><span className="brand-icon"><Leaf size={22} /></span><span>Campus<span className="brand-light">Tree</span></span></Link>
          <p className="footer-description">A marketplace built for students. Buy, sell and discover more on campus.</p>
        </div>
        <div><h4>Explore</h4><Link to="/marketplace">Marketplace</Link><Link to="/sell">Start selling</Link><Link to="/register">Create an account</Link></div>
        <div><h4>CampusTree</h4><a href="#about">About us</a><a href="mailto:hello@campustree.example">Contact</a><a href="#help">Help centre</a></div>
        <div><h4>Get in touch</h4><p><Mail size={15} /> hello@campustree.example</p><p><MapPin size={15} /> South Africa</p></div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} CampusTree. All rights reserved.</span><span>Made for student communities.</span></div>
    </footer>
  );
}
