import { NextResponse } from "next/server";
import { createClient } from "microcms-js-sdk";

export async function GET() {
  const apiKey = process.env.MICROCMS_API_KEY;
  if (!apiKey) {
    console.error(
      "⚠️  MICROCMS_API_KEY is not set. Please add it to .env.local (local) or Vercel project settings (production)"
    );
    return NextResponse.json(
      {
        error: "MICROCMS_API_KEY is not configured",
        hint: "Local: Create .env.local with MICROCMS_API_KEY=your_key | Production: Add to Vercel project settings",
      },
      { status: 500 }
    );
  }

  try {
    const client = createClient({
      serviceDomain: "2uo0wskuv5",
      apiKey: apiKey,
    });

    const data = await client.get({
      endpoint: "menu",
    });

    // Debug: Log the response to see the exact structure
    console.log("🔍 MicroCMS Response:", JSON.stringify(data, null, 2));

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching menu from MicroCMS:", err);
    return NextResponse.json(
      { error: "Failed to fetch menu from MicroCMS", details: String(err) },
      { status: 500 }
    );
  }
}
