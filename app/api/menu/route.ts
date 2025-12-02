import { NextResponse } from "next/server";

const MENU_API_URL = "https://2uo0wskuv5.microcms.io/api/v1/menu";

export async function GET() {
  const apiKey = process.env.MICROCMS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing MICROCMS_API_KEY environment variable" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(MENU_API_URL, {
      headers: { "X-API-KEY": apiKey },
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch menu from MicroCMS", details: data },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected error fetching menu", details: String(err) },
      { status: 500 }
    );
  }
}
