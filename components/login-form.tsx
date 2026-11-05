"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

function safeNext(next: string): string {
	return next.startsWith("/") && !next.startsWith("//") && !next.includes("\\") ? next : "/";
}

/** The LAN password gate (mobile/LAN round, 2026-11-04). One shared
 *  password; the server sets a signed, 30-day cookie. The page is chrome-
 *  free on purpose (AppFrame skips the sidebar for /login). */
export function LoginForm({ next }: { next: string }) {
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);

	async function submit(event: React.FormEvent) {
		event.preventDefault();
		if (!password || busy) return;
		setBusy(true);
		setError(null);
		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ password }),
			});
			const body = (await res.json().catch(() => ({}))) as { error?: string };
			if (!res.ok) {
				setError(body.error ?? "Sign in failed.");
				return;
			}
			window.location.assign(safeNext(next));
		} catch {
			setError("Could not reach the server. Is the Mac awake?");
		} finally {
			setBusy(false);
		}
	}

	return (
		<main className="flex min-h-dvh items-center justify-center bg-background px-6 py-12 text-foreground">
			<form
				onSubmit={submit}
				className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg"
			>
				<p className="font-ui text-xs uppercase tracking-widest text-muted-foreground">LearnHarness</p>
				<h1 className="mt-2 font-title text-3xl tracking-tight">This device</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					Enter the LAN password to open the learning session.
				</p>

				<label htmlFor="lan-password" className="mt-6 block font-ui text-xs uppercase tracking-wide text-muted-foreground">
					Password
				</label>
				<input
					id="lan-password"
					type="password"
					autoFocus
					autoComplete="current-password"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 font-prose text-base text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/60"
				/>
				{error && (
					<p role="alert" className="mt-3 text-sm text-destructive">
						{error}
					</p>
				)}
				<Button type="submit" disabled={!password || busy} className="mt-5 h-11 w-full">
					{busy ? "Opening…" : "Open LearnHarness"}
				</Button>
				<p className="mt-4 text-xs text-muted-foreground">
					The password lives in <span className="font-mono">.env.local</span> on the Mac that runs the server.
				</p>
			</form>
		</main>
	);
}
