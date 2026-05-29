"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  buildPricingInterestSummary,
  findBundle,
  parsePricingSelection,
} from "@/lib/pricing-form";
import type { PricingOptions, SiteSettings } from "@/lib/wordpress/types";

interface AskPriceModalProps {
  open: boolean;
  onClose: () => void;
  settings: SiteSettings;
  pricingOptions: PricingOptions;
}

export function AskPriceModal({ open, onClose, settings, pricingOptions }: AskPriceModalProps) {
  const titleId = useId();
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selection, setSelection] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const selectedBundle = useMemo(() => {
    const { kind, id } = parsePricingSelection(selection);
    return kind === "bundle" ? findBundle(pricingOptions.bundles, id) : undefined;
  }, [selection, pricingOptions.bundles]);

  useEffect(() => {
    if (!open) {
      setVisible(false);
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setStatus("idle");
      setErrorMessage("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selection) {
      setErrorMessage("Please choose a package or service.");
      return;
    }
    setStatus("loading");
    setErrorMessage("");

    const serviceInterest = buildPricingInterestSummary(selection, pricingOptions, budget, timeline);
    const { kind, id } = parsePricingSelection(selection);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "ask_price",
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          service_interest: serviceInterest,
          selection_kind: kind,
          selection_id: id,
          budget,
          timeline,
          message: message.trim(),
          page_url: typeof window !== "undefined" ? window.location.href : "",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.message || "Something went wrong.");
        return;
      }
      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setSelection("");
      setBudget("");
      setTimeline("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  };

  const hasBundles = pricingOptions.bundles.length > 0;
  const hasServices = pricingOptions.serviceGroups.some((g) => g.options.length > 0);

  return (
    <div
      className={`cws-modal-root cws-modal-root--apple${visible ? " is-visible" : ""}`}
      role="presentation"
    >
      <button type="button" className="cws-modal-backdrop" aria-label="Close dialog" onClick={onClose} />
      <div
        className="cws-modal-dialog cws-modal-dialog--pricing cws-modal--apple"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="cws-modal-header">
          <div>
            <p className="cws-modal-eyebrow">Get a quote</p>
            <h2 id={titleId} className="cws-modal-title">
              Request pricing
            </h2>
          </div>
          <button type="button" className="cws-modal-close" onClick={onClose} aria-label="Close">
            <i className="fas fa-times" aria-hidden="true" />
          </button>
        </div>

        {status === "success" ? (
          <div className="cws-modal-body cws-modal-success">
            <div className="cws-modal-success-icon" aria-hidden="true">
              <i className="fas fa-check" />
            </div>
            <p>
              Thank you! We&apos;ll send a tailored estimate
              {settings.email ? ` to ${settings.email}` : ""} and may call you on the number you provided.
            </p>
            <button type="button" className="cws-modal-btn cws-modal-btn--primary" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form className="cws-modal-body" onSubmit={handleSubmit}>
            <p className="cws-modal-lead">
              Pick a package or service — add budget and timeline so we can quote faster.
            </p>

            <div className="cws-modal-field">
              <label className="cws-modal-label" htmlFor="ask-selection">
                Package or service <span className="cws-modal-required">*</span>
              </label>
              <select
                id="ask-selection"
                className="cws-modal-select"
                required
                value={selection}
                onChange={(e) => setSelection(e.target.value)}
              >
                <option value="">Select one…</option>
                {hasBundles ? (
                  <optgroup label="Popular packages">
                    {pricingOptions.bundles.map((b) => (
                      <option key={b.id} value={`bundle:${b.id}`}>
                        {b.label}
                      </option>
                    ))}
                  </optgroup>
                ) : null}
                {hasServices
                  ? pricingOptions.serviceGroups.map((group) =>
                      group.options.length ? (
                        <optgroup key={group.label} label={group.label}>
                          {group.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </optgroup>
                      ) : null,
                    )
                  : null}
              </select>
              {selectedBundle ? (
                <div className="ask-price-hint">
                  <p className="mb-1">{selectedBundle.summary}</p>
                  {selectedBundle.includes?.length ? (
                    <ul className="mb-0 ps-3">
                      {selectedBundle.includes.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="cws-modal-row">
              <div className="cws-modal-field">
                <label className="cws-modal-label" htmlFor="ask-budget">
                  Approx. budget
                </label>
                <select
                  id="ask-budget"
                  className="cws-modal-select"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                >
                  <option value="">Optional</option>
                  {pricingOptions.budgetRanges.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="cws-modal-field">
                <label className="cws-modal-label" htmlFor="ask-timeline">
                  Timeline
                </label>
                <select
                  id="ask-timeline"
                  className="cws-modal-select"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                >
                  <option value="">Optional</option>
                  {pricingOptions.timelines.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="cws-modal-field">
              <label className="cws-modal-label" htmlFor="ask-name">
                Full name <span className="cws-modal-required">*</span>
              </label>
              <input
                id="ask-name"
                className="cws-modal-input"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="cws-modal-row">
              <div className="cws-modal-field">
                <label className="cws-modal-label" htmlFor="ask-email">
                  Email <span className="cws-modal-required">*</span>
                </label>
                <input
                  id="ask-email"
                  type="email"
                  className="cws-modal-input"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="cws-modal-field">
                <label className="cws-modal-label" htmlFor="ask-phone">
                  Phone / WhatsApp <span className="cws-modal-required">*</span>
                </label>
                <input
                  id="ask-phone"
                  type="tel"
                  className="cws-modal-input"
                  required
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 …"
                />
              </div>
            </div>

            <div className="cws-modal-field">
              <label className="cws-modal-label" htmlFor="ask-msg">
                Anything else? (optional)
              </label>
              <textarea
                id="ask-msg"
                className="cws-modal-textarea"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Pages, integrations, preferred call time…"
              />
            </div>

            {status === "error" && errorMessage ? (
              <p className="cws-modal-alert cws-modal-alert--error" role="alert">
                {errorMessage}
              </p>
            ) : null}

            <div className="cws-modal-actions">
              <button type="button" className="cws-modal-btn cws-modal-btn--secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="cws-modal-btn cws-modal-btn--primary" disabled={status === "loading"}>
                {status === "loading" ? "Sending…" : "Get my quote"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
