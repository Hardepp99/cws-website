import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const paths: string[] = body.paths || ["/"];

    for (const path of paths) {
      revalidatePath(path);
    }

    if (body.slug) {
      revalidatePath(`/${body.slug}`);
    }

    return NextResponse.json({ revalidated: true, paths });
  } catch {
    revalidatePath("/");
    return NextResponse.json({ revalidated: true, paths: ["/"] });
  }
}
