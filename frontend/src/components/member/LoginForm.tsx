"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { GoogleSignInButton } from "@/components/member/GoogleSignInButton";
import { MemberAuthLayout } from "@/components/member/MemberAuthLayout";
import { useMemberSession } from "@/components/member/MemberSessionProvider";
import { memberLogin } from "@/lib/member/client";

export function LoginForm() {
  const router = useRouter();
  const { refresh } = useMemberSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      await memberLogin(email, password);
      await refresh();
      router.push("/account");
      router.refresh();
    } catch (ex) {
      setErr(String(ex));
    } finally {
      setLoading(false);
    }
  }

  return (
    <MemberAuthLayout
      title="Sign in"
      subtitle="Welcome back. Enter your credentials to access your account."
      footerLabel="New here?"
      footerHref="/account/signup"
      footerLinkText="Create an account"
    >
      <form onSubmit={onSubmit} className="member-auth-form" noValidate>
        <div className="member-auth-field">
          <label htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            type="email"
            className="member-auth-input"
            required
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="member-auth-field">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            className="member-auth-input"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {err ? (
          <div className="member-auth-alert member-auth-alert--error" role="alert">
            {err}
          </div>
        ) : null}
        <button type="submit" className="member-auth-submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="member-auth-divider">
        <span>or continue with</span>
      </div>

      <div className="member-auth-oauth">
        <GoogleSignInButton
          onSuccess={async () => {
            await refresh();
            router.push("/account");
            router.refresh();
          }}
        />
      </div>
    </MemberAuthLayout>
  );
}
