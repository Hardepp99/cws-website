import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, phone, subject, budget, message } = body;

  if (!name || !email || !phone || !subject || !budget || !message) {
    return NextResponse.json({ success: false, message: "All fields are required." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ success: false, message: "Invalid email address." }, { status: 400 });
  }

  const { postToCms } = await import("@/lib/cms/forms");
  const cmsRes = await postToCms("/contact", body);
  if (cmsRes?.success !== undefined) return NextResponse.json(cmsRes);

  console.info("[Contact]", { name, email, phone, subject, budget, message });

  return NextResponse.json({
    success: true,
    message: "Thank you! We will contact you soon.",
  });
}
