"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  buildPricingInterestSummary,
  findBundle,
  parsePricingSelection,
} from "@/lib/pricing-form";
import type { PricingOptions } from "@/lib/wordpress/types";
import type { SiteSettings } from "@/lib/wordpress/types";

interface AskPriceModalProps {
  open: boolean;
  onClose: () => void;
  settings: SiteSettings;
  pricingOptions: PricingOptions;
}

export function AskPriceModal({ open, onClose, settings, pricingOptions }: AskPriceModalProps) {
  const titleId = useId();
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
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setStatus("idle");
      setErrorMessage("");
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selection) {
      setErrorMessage("Please choose a package or service.");
      return;
    }
    setStatus("loading");
    setErrorMessage("");

    const serviceInterest = buildPricingInterestSummary(
      selection,
      pricingOptions,
      budget,
      timeline
    );
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
    <div className="cws-modal-root" role="presentation">
      <button type="button" className="cws-modal-backdrop" aria-label="Close dialog" onClick={onClose} />
      <div className="cws-modal-dialog cws-modal-dialog--pricing" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="cws-modal-header">
          <h2 id={titleId} className="cws-modal-title">
            Request pricing
          </h2>
          <button type="button" className="cws-modal-close" onClick={onClose} aria-label="Close">
            <i className="fas fa-times" aria-hidden="true" />
          </button>
        </div>
        {status === "success" ? (
          <div className="cws-modal-body">
            <p className="mb-0 text-success fw-semibold">
              Thank you! We&apos;ll send a tailored estimate to {settings.email || "our team"} and may call you on the
              number provided.
            </p>
            <button type="button" className="btn btn-primary-custom btn-sm mt-3" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form className="cws-modal-body" onSubmit={handleSubmit}>
            <p className="cws-modal-lead text-muted small mb-3">
              Pick a ready-made package or a single service — add budget and timeline so we can quote faster.
            </p>

            <div className="mb-2">
              <label className="form-label small fw-semibold" htmlFor="ask-selection">
                Package or service <span className="text-danger">*</span>
              </label>
              <select
                id="ask-selection"
                className="form-select form-select-sm"
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
                      ) : null
                    )
                  : null}
              </select>
              {selectedBundle ? (
                <div className="ask-price-hint mt-2">
                  <p className="small mb-1 text-muted">{selectedBundle.summary}</p>
                  {selectedBundle.includes?.length ? (
                    <ul className="small mb-0 ps-3 text-muted">
                      {selectedBundle.includes.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="row g-2 mb-2">
              <div className="col-md-6">
                <label className="form-label small fw-semibold" htmlFor="ask-budget">
                  Approx. budget
                </label>
                <select
                  id="ask-budget"
                  className="form-select form-select-sm"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                >
                  <option value="">Select range (optional)</option>
                  {pricingOptions.budgetRanges.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold" htmlFor="ask-timeline">
                  When do you need it?
                </label>
                <select
                  id="ask-timeline"
                  className="form-select form-select-sm"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                >
                  <option value="">Select timeline (optional)</option>
                  {pricingOptions.timelines.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-2">
              <label className="form-label small fw-semibold" htmlFor="ask-name">
                Full name <span className="text-danger">*</span>
              </label>
              <input
                id="ask-name"
                className="form-control form-control-sm"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="row g-2 mb-2">
              <div className="col-md-6">
                <label className="form-label small fw-semibold" htmlFor="ask-email">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  id="ask-email"
                  type="email"
                  className="form-control form-control-sm"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold" htmlFor="ask-phone">
                  Phone / WhatsApp <span className="text-danger">*</span>
                </label>
                <input
                  id="ask-phone"
                  type="tel"
                  className="form-control form-control-sm"
                  required
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 …"
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold" htmlFor="ask-msg">
                Anything else? (optional)
              </label>
              <textarea
                id="ask-msg"
                className="form-control form-control-sm"
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. number of pages, integrations, preferred call time"
              />
            </div>
            {status === "error" ? (
              <p className="text-danger small mb-2" role="alert">
                {errorMessage}
              </p>
            ) : null}
            <div className="d-flex gap-2 justify-content-end flex-wrap">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary-custom btn-sm" disabled={status === "loading"}>
                {status === "loading" ? "Sending…" : "Get my quote"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
