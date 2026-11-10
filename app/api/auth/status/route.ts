import { NextResponse } from "next/server";
import { lanAccessEnabled } from "@/src/server";

export const dynamic = "force-dynamic";

export async function GET() {
	return NextResponse.json({ enabled: lanAccessEnabled() }, { headers: { "Cache-Control": "no-store" } });
}
