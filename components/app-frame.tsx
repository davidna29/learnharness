"use client";

/**
 * The app chrome is not the login surface (LAN round, 2026-11-04). The
 * root layout mounts this client frame so `/login` can render bare while
 * every authenticated route keeps the providers and sidebar it had.
 */

import { usePathname } from "next/navigation";
import { AppShell, SidebarProvider } from "@/components/sidebar";
import { ActivityProvider } from "@/components/activity-dock";
import { ServerEventsProvider } from "@/components/server-events";
import { AppearanceProvider } from "@/components/settings/appearance";
import { ContentLanguageProvider } from "@/components/content-language";

export function AppFrame({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	if (pathname === "/login") return <>{children}</>;
	return (
		<ServerEventsProvider>
			<AppearanceProvider>
				<ContentLanguageProvider>
					<SidebarProvider>
						<ActivityProvider>
							<AppShell>{children}</AppShell>
						</ActivityProvider>
					</SidebarProvider>
				</ContentLanguageProvider>
			</AppearanceProvider>
		</ServerEventsProvider>
	);
}
