import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { lang } = await request.json();
    if (lang !== "ru" && lang !== "ka") {
      return NextResponse.json({ error: "Invalid language" }, { status: 400 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set("lang", lang, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return res;
  } catch (e) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}



