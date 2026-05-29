"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { memberGoogleLogin } from "@/lib/member/client";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (cfg: Record<string, unknown>) => void;
          renderButton: (el: HTMLElement, cfg: Record<string, unknown>) => void;
        };
      };
    };
  }
}

export function GoogleSignInButton({ onSuccess }: { onSuccess: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || !ref.current || !window.google?.accounts?.id) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response: { credential?: string }) => {
        if (!response.credential) return;
        await memberGoogleLogin(response.credential);
        onSuccess();
      },
    });
    ref.current.innerHTML = "";
    const width = Math.min(400, Math.max(280, ref.current.offsetWidth || 320));
    window.google.accounts.id.renderButton(ref.current, {
      theme: "outline",
      size: "large",
      width,
      text: "continue_with",
      shape: "rectangular",
    });
  }, [clientId, onSuccess]);

  if (!clientId) {
    return (
      <p className="member-auth-google-fallback">
        Google sign-in is not configured. Set <code>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> in your environment.
      </p>
    );
  }

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      <div ref={ref} className="member-auth-google" />
    </>
  );
}
