/**
 * LAN access gate (mobile/LAN round, 2026-11-04): one shared password and
 * one signed, expiry-bound cookie. This is a single-user local-network
 * gate, not accounts or multi-user isolation.
 *
 * The gate is OFF unless `LH_ACCESS_PASSWORD` is set — local dev/Herd and
 * the desktop shell keep their existing trusted behaviour. The LAN runner
 * loads `.env.local`, which supplies the password (and optionally a
 * session secret); `next start` reads the same file.
 */

import { createHash, createHmac, timingSafeEqual } from "node:crypto";

type LanEnv = Record<string, string | undefined>;

export const LAN_SESSION_COOKIE = "lh_lan_session";
export const LAN_SESSION_MAX_AGE_S = 30 * 24 * 60 * 60;

export function lanAccessEnabled(env: LanEnv = process.env): boolean {
	return typeof env.LH_ACCESS_PASSWORD === "string" && env.LH_ACCESS_PASSWORD.length > 0;
}

function sessionKey(env: LanEnv): string {
	if (typeof env.LH_SESSION_SECRET === "string" && env.LH_SESSION_SECRET.length > 0) {
		return env.LH_SESSION_SECRET;
	}
	// A derived key keeps manual `next start` runs working with just the
	// password. Changing the password invalidates sessions either way.
	return createHash("sha256").update(`lh-lan:${env.LH_ACCESS_PASSWORD ?? ""}`).digest("hex");
}

function signature(expires: number, env: LanEnv): string {
	return createHmac("sha256", sessionKey(env)).update(String(expires)).digest("base64url");
}

/** A fresh cookie value (`<expiry>.<hmac>`). */
export function createLanSession(
	env: LanEnv = process.env,
	now = Date.now(),
): { token: string; expires: number } {
	const expires = now + LAN_SESSION_MAX_AGE_S * 1000;
	return { token: `${expires}.${signature(expires, env)}`, expires };
}

export function verifyLanSession(
	token: string | undefined,
	env: LanEnv = process.env,
	now = Date.now(),
): boolean {
	if (!token) return false;
	const [raw, supplied, ...rest] = token.split(".");
	if (!raw || !supplied || rest.length > 0 || !/^\d+$/.test(raw)) return false;
	const expires = Number(raw);
	if (!Number.isFinite(expires) || expires <= now) return false;
	const expected = signature(expires, env);
	const a = Buffer.from(supplied);
	const b = Buffer.from(expected);
	return a.length === b.length && timingSafeEqual(a, b);
}

/** Constant-time password comparison (hashing first keeps both buffers
 *  the same length). */
export function lanPasswordMatches(input: unknown, env: LanEnv = process.env): boolean {
	if (typeof input !== "string" || typeof env.LH_ACCESS_PASSWORD !== "string") return false;
	const a = createHash("sha256").update(input).digest();
	const b = createHash("sha256").update(env.LH_ACCESS_PASSWORD).digest();
	return timingSafeEqual(a, b);
}

export function lanSessionCookie(token: string, secure: boolean): {
	name: string;
	value: string;
	httpOnly: true;
	sameSite: "lax";
	secure: boolean;
	path: "/";
	maxAge: number;
} {
	return {
		name: LAN_SESSION_COOKIE,
		value: token,
		httpOnly: true,
		sameSite: "lax",
		secure,
		path: "/",
		maxAge: LAN_SESSION_MAX_AGE_S,
	};
}

export function lanClearCookie(secure: boolean) {
	return {
		name: LAN_SESSION_COOKIE,
		value: "",
		httpOnly: true,
		sameSite: "lax" as const,
		secure,
		path: "/" as const,
		maxAge: 0,
	};
}

/** Only same-site paths; never an open redirect (`//evil`, backslashes). */
export function safeReturnPath(next: string | null | undefined): string {
	if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return "/";
	return next;
}
