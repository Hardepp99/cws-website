import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, phone, course, message } = body;

  if (!name || !email || !phone || !course) {
    return NextResponse.json(
      { success: false, message: "Name, email, phone, and course are required." },
      { status: 400 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ success: false, message: "Invalid email address." }, { status: 400 });
  }

  const { postToCms } = await import("@/lib/cms/forms");
  const cmsRes = await postToCms("/api/v1/enrollment", body);
  if (cmsRes) return NextResponse.json(cmsRes);

  const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  if (wpUrl) {
    try {
      const res = await fetch(`${wpUrl}/wp-json/cws/v1/enrollment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (res.ok) return NextResponse.json(json);
    } catch {
      /* fallback */
    }
  }

  console.info("[Enrollment]", { name, email, phone, course, message });

  return NextResponse.json({
    success: true,
    message: "Enrollment request received. We will contact you soon.",
  });
}
