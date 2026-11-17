import { useState } from "react";
import type { FormEvent } from "react";
import { ImagePlus, PackagePlus } from "lucide-react";
import {  useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import ProtectedRoute from "../components/common/ProtectedRoute";

function SellForm() {
  const { addProduct, user } = useApp();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Books");
  const [condition, setCondition] = useState<"New" | "Like new" | "Good" | "Fair">("Good");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    addProduct({ title, description, price: Number(price), category, condition, image: image || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900", university: user.university });
    setMessage("Your product has been listed successfully.");
    setTimeout(() => navigate("/dashboard"), 900);
  };

  return <main className="container page-section narrow-container"><div className="page-heading"><span className="eyebrow">SELL ON CAMPUSTREE</span><h1>List a product</h1><p>Give your item a clear description so other students know what they're buying.</p></div>
    <form onSubmit={submit} className="listing-form">
      <label>Product title<input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Engineering textbook" required /></label>
      <label>Description<textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the item, its features and any signs of wear..." rows={5} required /></label>
      <div className="form-two-col"><label>Price (ZAR)<input type="number" min="1" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="250" required /></label><label>Category<select value={category} onChange={e => setCategory(e.target.value)}>{["Books", "Electronics", "Fashion", "Home & Living", "Services", "Other"].map(item => <option key={item}>{item}</option>)}</select></label></div>
      <label>Condition<select value={condition} onChange={e => setCondition(e.target.value as typeof condition)}><option>New</option><option>Like new</option><option>Good</option><option>Fair</option></select></label>
      <label>Image URL <span className="optional-label">(optional)</span><div className="input-wrap"><ImagePlus size={17} /><input value={image} onChange={e => setImage(e.target.value)} placeholder="https://example.com/product-image.jpg" /></div></label>
      {message && <div className="form-success">{message}</div>}
      <button className="button button-primary button-large full-width"><PackagePlus size={18} /> Publish listing</button>
      <p className="form-footnote">Your listing will be visible in the CampusTree marketplace. Product image uploads will be connected to backend storage later.</p>
    </form>
  </main>;
}

export default function Sell() {
  return <ProtectedRoute sellerOnly><SellForm /></ProtectedRoute>;
}
