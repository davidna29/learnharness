import { NextResponse } from "next/server";
import { lanClearCookie } from "@/src/server";

export const dynamic = "force-dynamic";

function secureRequest(request: Request): boolean {
	return request.headers.get("x-forwarded-proto") === "https"
		|| new URL(request.url).protocol === "https:";
}

export async function POST(request: Request) {
	const response = NextResponse.json({ ok: true });
	response.cookies.set(lanClearCookie(secureRequest(request)));
	return response;
}
