"use client";

import { FormEvent, useState } from "react";

export function EnrollmentForm({ defaultCourse = "" }: { defaultCourse?: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/enrollment", {
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
    <form onSubmit={handleSubmit} className="enrollment-form">
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
          <input type="text" name="course" className="form-control" placeholder="Course *" defaultValue={defaultCourse} required />
        </div>
        <div className="col-12">
          <textarea name="message" className="form-control" rows={4} placeholder="Message (optional)" />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary-custom w-100" disabled={status === "loading"}>
            {status === "loading" ? "Submitting..." : "Enroll Now"}
          </button>
        </div>
      </div>
      {message && (
        <p className={`mt-3 ${status === "success" ? "text-success" : "text-danger"}`}>{message}</p>
      )}
    </form>
  );
}
