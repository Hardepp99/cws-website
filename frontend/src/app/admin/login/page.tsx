"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { adminLogin } from "@/lib/admin/client";
import { CWS_LOGO_PATH } from "@/lib/site-brand";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await adminLogin(username, password);
    setLoading(false);
    if (!res.success) {
      setError(res.message || "Login failed. Check username/password and that WAMP + CMS API are running.");
      return;
    }
    router.push(search.get("from") || "/admin");
    router.refresh();
  }

  return (
    <div className="cms-login-wrap">
      <form className="cms-login-box" onSubmit={onSubmit}>
        <div className="cms-login-logo">
          <Image src={CWS_LOGO_PATH} alt="Creative Web Solutions" width={200} height={52} priority />
        </div>
        <h1>Content Manager</h1>
        <p className="cms-login-sub">Sign in to edit your website — pages, homepage, menus, and leads.</p>
        {error ? <div className="cms-notice err">{error}</div> : null}
        <label className="cms-label">Username</label>
        <input
          className="cms-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
        <label className="cms-label">Password</label>
        <input
          className="cms-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <p style={{ marginTop: 20 }}>
          <button type="submit" className="cms-btn cms-btn-green" disabled={loading}>
            {loading ? "Signing in…" : "Log in to CMS"}
          </button>
        </p>
      </form>
      <p className="cms-login-promo">
        <Link href="/">← Back to website</Link>
      </p>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="cms-login-page">
      <Suspense fallback={<div className="cms-login-wrap"><div className="cms-login-box">Loading…</div></div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
