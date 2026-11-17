import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, LockKeyhole, Mail } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (login(email, password)) navigate("/dashboard");
    else setError("Account not found. Register first or check your details.");
  };

  return <main className="auth-page"><section className="auth-card"><div className="auth-brand"><span className="brand-icon"><Leaf /></span><span>Welcome back</span></div><h1>Log in to CampusTree</h1><p>Continue buying and selling with your student community.</p>
    <form onSubmit={submit} className="form-stack"><label>Email address<div className="input-wrap"><Mail size={17} /><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required /></div></label><label>Password<div className="input-wrap"><LockKeyhole size={17} /><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required /></div></label>{error && <div className="form-error">{error}</div>}<button className="button button-primary button-large full-width">Log in</button></form>
    <div className="auth-switch">New to CampusTree? <Link to="/register">Create an account</Link></div><div className="demo-hint">Demo mode: create an account on the registration page to test login.</div>
  </section></main>;
}
