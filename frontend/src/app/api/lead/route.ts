import { NextRequest, NextResponse } from "next/server";

const ASK_PRICE_FIELDS = ["name", "email", "phone"] as const;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const source = String(body.source || "").trim() || "ask_price";
  const page_url =
    typeof body.page_url === "string" ? body.page_url : typeof body.pageUrl === "string" ? body.pageUrl : "";

  const payload = {
    source: source === "callback_popup" ? "callback_popup" : "ask_price",
    name: String(body.name || "").trim(),
    email: String(body.email || "").trim(),
    phone: String(body.phone || "").replace(/\s/g, ""),
    message: String(body.message || "").trim(),
    service_interest: String(body.service_interest || body.serviceInterest || "").trim(),
    selection_kind: String(body.selection_kind || "").trim(),
    selection_id: String(body.selection_id || "").trim(),
    budget: String(body.budget || "").trim(),
    timeline: String(body.timeline || "").trim(),
    page_url: page_url.slice(0, 500),
  };

  if (payload.source === "callback_popup") {
    if (!payload.phone || payload.phone.length < 8) {
      return NextResponse.json({ success: false, message: "Please enter a valid mobile number." }, { status: 400 });
    }
  } else {
    for (const k of ASK_PRICE_FIELDS) {
      if (!payload[k]) {
        return NextResponse.json({ success: false, message: "Name, email, and phone are required." }, { status: 400 });
      }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      return NextResponse.json({ success: false, message: "Invalid email address." }, { status: 400 });
    }
    if (!payload.service_interest) {
      return NextResponse.json(
        { success: false, message: "Please select a package or service." },
        { status: 400 }
      );
    }
  }

  const { postToCms } = await import("@/lib/cms/forms");
  const cmsRes = await postToCms("/api/v1/lead", payload);
  if (cmsRes) return NextResponse.json(cmsRes);

  const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  if (wpUrl) {
    try {
      const res = await fetch(`${wpUrl}/wp-json/cws/v1/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (res.ok) return NextResponse.json(json);
    } catch {
      /* fall through */
    }
  }

  console.info("[Lead]", payload);

  return NextResponse.json({
    success: true,
    message: "Thank you! Our team will reach out shortly.",
  });
}
