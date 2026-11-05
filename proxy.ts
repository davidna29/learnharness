import { NextResponse, type NextRequest } from "next/server";
import { desktopAPIAuthorized } from "./src/server/desktop-access.ts";
import {
	LAN_SESSION_COOKIE,
	lanAccessEnabled,
	verifyLanSession,
} from "./src/server/lan-auth.ts";

/** The same-origin URL a browser actually used. The LAN TLS proxy forwards
 * the public Host and `x-forwarded-proto`, so redirects never leak the
 * loopback upstream. */
function publicUrl(request: NextRequest, path: string): URL {
	const proto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim()
		|| request.nextUrl.protocol.replace(":", "");
	const host = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim()
		|| request.headers.get("host")
		|| request.nextUrl.host;
	return new URL(path, `${proto}://${host}`);
}

/** Desktop capability gate for the loopback shell, then the optional LAN
 * password gate. With no `LH_ACCESS_PASSWORD`, behaviour is unchanged
 * (dev/Herd and the desktop app keep their trusted mode). */
export function proxy(request: NextRequest) {
	const { pathname, search } = request.nextUrl;

	if (pathname.startsWith("/api") && !desktopAPIAuthorized(request.headers)) {
		return NextResponse.json(
			{ error: "Desktop API access requires the trusted LearnHarness window." },
			{ status: 403, headers: { "Cache-Control": "no-store" } },
		);
	}

	if (!lanAccessEnabled()) return NextResponse.next();

	const publicPath = pathname === "/login" || pathname.startsWith("/api/auth/");
	const authed = verifyLanSession(request.cookies.get(LAN_SESSION_COOKIE)?.value);

	if (publicPath) {
		if (pathname === "/login" && authed) {
			return NextResponse.redirect(publicUrl(request, "/"));
		}
		return NextResponse.next();
	}

	if (authed) return NextResponse.next();

	if (pathname.startsWith("/api")) {
		return NextResponse.json(
			{ error: "Sign in required." },
			{ status: 401, headers: { "Cache-Control": "no-store" } },
		);
	}

	const next = encodeURIComponent(pathname + search);
	return NextResponse.redirect(publicUrl(request, `/login?next=${next}`));
}

export const config = {
	matcher: "/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|manifest.webmanifest|sw.js|worklets/|fonts/).*)",
};
