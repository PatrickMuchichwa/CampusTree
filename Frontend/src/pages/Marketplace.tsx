import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/products/ProductCard";
import { categories } from "../data/products";
import { useApp } from "../context/AppContext";

export default function Marketplace() {
  const { products } = useApp();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(params.get("category") || "All");
  const [sort, setSort] = useState("newest");

  const filtered = useMemo(() => {
    const result = products.filter(product => {
      const matchesCategory = category === "All" || product.category === category;
      const term = search.toLowerCase();
      const matchesSearch = `${product.title} ${product.description} ${product.university}`.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
    if (sort === "low") result.sort((a, b) => a.price - b.price);
    if (sort === "high") result.sort((a, b) => b.price - a.price);
    if (sort === "newest") result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return result;
  }, [products, category, search, sort]);

  const changeCategory = (value: string) => {
    setCategory(value);
    if (value === "All") params.delete("category");
    else params.set("category", value);
    setParams(params);
  };

  return (
    <main className="page-section container">
      <div className="page-heading"><span className="eyebrow">DISCOVER YOUR NEXT FIND</span><h1>Campus marketplace</h1><p>Explore products listed by students in your community.</p></div>
      <div className="market-toolbar">
        <div className="search-box"><Search size={19} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products, categories or universities..." /></div>
        <label className="sort-select"><SlidersHorizontal size={17} /><select value={sort} onChange={e => setSort(e.target.value)}><option value="newest">Newest first</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label>
      </div>
      <div className="market-layout">
        <aside className="filter-panel"><h3>Categories</h3>{categories.map(item => <button key={item} onClick={() => changeCategory(item)} className={`filter-option ${category === item ? "selected" : ""}`}>{item}<span>{item === "All" ? products.length : products.filter(p => p.category === item).length}</span></button>)}</aside>
        <section className="market-results"><div className="results-heading"><strong>{filtered.length} products found</strong><span>{category === "All" ? "All categories" : category}</span></div>{filtered.length ? <div className="product-grid">{filtered.map(product => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state"><Search size={30} /><h3>No products found</h3><p>Try another search term or category.</p><button className="button button-primary" onClick={() => { setSearch(""); changeCategory("All"); }}>Clear filters</button></div>}</section>
      </div>
    </main>
  );
}
