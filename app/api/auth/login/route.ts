import { NextResponse } from "next/server";
import {
	createLanSession,
	lanAccessEnabled,
	lanPasswordMatches,
	lanSessionCookie,
} from "@/src/server";

export const dynamic = "force-dynamic";

const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

function clientKey(request: Request): string {
	const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
	return forwarded || request.headers.get("x-real-ip") || "local";
}

function secureRequest(request: Request): boolean {
	return request.headers.get("x-forwarded-proto") === "https"
		|| new URL(request.url).protocol === "https:";
}

export async function POST(request: Request) {
	if (!lanAccessEnabled()) {
		return NextResponse.json({ error: "The LAN access gate is not enabled." }, { status: 400 });
	}
	const key = clientKey(request);
	const now = Date.now();
	const entry = attempts.get(key);
	if (entry && entry.resetAt > now && entry.count >= MAX_ATTEMPTS) {
		return NextResponse.json(
			{ error: "Too many attempts. Try again in a minute." },
			{ status: 429, headers: { "Retry-After": "60" } },
		);
	}
	const body = (await request.json().catch(() => null)) as { password?: unknown } | null;
	if (!lanPasswordMatches(body?.password)) {
		const next = entry && entry.resetAt > now ? entry : { count: 0, resetAt: now + WINDOW_MS };
		next.count += 1;
		attempts.set(key, next);
		return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
	}
	attempts.delete(key);
	const { token } = createLanSession();
	const response = NextResponse.json({ ok: true });
	response.cookies.set(lanSessionCookie(token, secureRequest(request)));
	return response;
}
