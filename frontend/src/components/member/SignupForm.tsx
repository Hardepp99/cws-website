"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { GoogleSignInButton } from "@/components/member/GoogleSignInButton";
import { MemberAuthLayout } from "@/components/member/MemberAuthLayout";
import { useMemberSession } from "@/components/member/MemberSessionProvider";
import { memberRegister } from "@/lib/member/client";

export function SignupForm() {
  const router = useRouter();
  const { refresh } = useMemberSession();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErr("Passwords do not match.");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      await memberRegister({ email, password, confirmPassword, displayName });
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
      title="Create account"
      subtitle="Join the community with email or your Google account."
      footerLabel="Already have an account?"
      footerHref="/account/login"
      footerLinkText="Sign in"
    >
      <form onSubmit={onSubmit} className="member-auth-form" noValidate>
        <div className="member-auth-field">
          <label htmlFor="signup-name">Full name</label>
          <input
            id="signup-name"
            type="text"
            className="member-auth-input"
            required
            autoComplete="name"
            placeholder="Your name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className="member-auth-field">
          <label htmlFor="signup-email">Email address</label>
          <input
            id="signup-email"
            type="email"
            className="member-auth-input"
            required
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="member-auth-field-row">
          <div className="member-auth-field">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              className="member-auth-input"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="member-auth-field">
            <label htmlFor="signup-confirm">Confirm</label>
            <input
              id="signup-confirm"
              type="password"
              className="member-auth-input"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        {err ? (
          <div className="member-auth-alert member-auth-alert--error" role="alert">
            {err}
          </div>
        ) : null}
        <button type="submit" className="member-auth-submit" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
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

      <p className="member-auth-legal">
        By signing up you agree to participate respectfully in community discussions. Content may be moderated.
      </p>
    </MemberAuthLayout>
  );
}
