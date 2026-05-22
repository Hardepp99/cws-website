"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data)),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
        setMessage(json.message);
        form.reset();
      } else {
        setStatus("error");
        setMessage(json.message || "Submission failed.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="row g-3">
        <div className="col-md-6">
          <input type="text" name="name" className="form-control" placeholder="Your Name *" required />
        </div>
        <div className="col-md-6">
          <input type="email" name="email" className="form-control" placeholder="Email *" required />
        </div>
        <div className="col-md-6">
          <input type="tel" name="phone" className="form-control" placeholder="Phone *" required />
        </div>
        <div className="col-md-6">
          <input type="text" name="subject" className="form-control" placeholder="Subject *" required />
        </div>
        <div className="col-12">
          <select name="budget" className="form-select" required defaultValue="">
            <option value="" disabled>
              Select Budget *
            </option>
            <option value="Under ₹25,000">Under ₹25,000</option>
            <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
            <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
            <option value="Above ₹1,00,000">Above ₹1,00,000</option>
          </select>
        </div>
        <div className="col-12">
          <textarea name="message" className="form-control" rows={5} placeholder="Message *" required />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary-custom w-100" disabled={status === "loading"}>
            {status === "loading" ? "Sending..." : "Send Message"}
          </button>
        </div>
      </div>
      {message && (
        <p className={`mt-3 ${status === "success" ? "text-success" : "text-danger"}`}>{message}</p>
      )}
    </form>
  );
}
