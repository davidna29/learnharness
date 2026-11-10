"use client";

import { useEffect } from "react";

/** Registers the network-only worker on secure origins (localhost and the
 *  LAN HTTPS door). No-op elsewhere. */
export function PwaRegister() {
	useEffect(() => {
		if (!("serviceWorker" in navigator) || !window.isSecureContext) return;
		void navigator.serviceWorker.register("/sw.js").catch(() => {});
	}, []);
	return null;
}
