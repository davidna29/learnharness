"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SettingsRow } from "./controls.tsx";

/** Sign out of the LAN session. Hidden when the gate is off (local dev). */
export function LanSignOut() {
	const [enabled, setEnabled] = useState(false);
	useEffect(() => {
		void fetch("/api/auth/status", { cache: "no-store" })
			.then((res) => res.json() as Promise<{ enabled?: boolean }>)
			.then((body) => setEnabled(body.enabled === true))
			.catch(() => setEnabled(false));
	}, []);
	if (!enabled) return null;
	return (
		<SettingsRow
			label="LAN access"
			hint="Sign out of this device. The server keeps running."
			testid="lan-signout-row"
		>
			<Button
				type="button"
				variant="outline"
				size="sm"
				data-testid="lan-signout"
				onClick={() => {
					void fetch("/api/auth/logout", { method: "POST" }).finally(() => {
						window.location.assign("/login");
					});
				}}
			>
				Sign out
			</Button>
		</SettingsRow>
	);
}
