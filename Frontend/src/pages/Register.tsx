import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, UserRound, Mail, LockKeyhole, GraduationCap } from "lucide-react";
import { useApp } from "../context/AppContext";
import type { UserRole } from "../types";

export default function Register() {
  const { register } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [university, setUniversity] = useState("University of Johannesburg");
  const [role, setRole] = useState<UserRole>("buyer");
  const [error, setError] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    try {
      register(name, email, password, role, university);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    }
  };

  return <main className="auth-page"><section className="auth-card auth-card-wide"><div className="auth-brand"><span className="brand-icon"><Leaf /></span><span>Join the community</span></div><h1>Create your account</h1><p>One account to discover, buy and sell student essentials.</p>
    <form onSubmit={submit} className="form-stack">
      <label>Full name<div className="input-wrap"><UserRound size={17} /><input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required /></div></label>
      <label>Email address<div className="input-wrap"><Mail size={17} /><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required /></div></label>
      <label>Password<div className="input-wrap"><LockKeyhole size={17} /><input type="password" minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" required /></div></label>
      <label>University<div className="input-wrap"><GraduationCap size={17} /><input value={university} onChange={e => setUniversity(e.target.value)} required /></div></label>
      <label>I want to join as<select className="form-select" value={role} onChange={e => setRole(e.target.value as UserRole)}><option value="buyer">Buyer</option><option value="seller">Seller</option></select></label>
      {error && <div className="form-error">{error}</div>}
      <button className="button button-primary button-large full-width">Create account</button>
    </form>
    <div className="auth-switch">Already have an account? <Link to="/login">Log in</Link></div><div className="demo-hint">Prototype note: account details are stored in this browser only. Do not use real passwords.</div>
  </section></main>;
}
