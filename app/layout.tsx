import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Source_Sans_3 } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { AppFrame } from "@/components/app-frame";
import { PwaRegister } from "@/components/pwa-register";
import UpdateBanner from "@/components/update-banner";

// Chrome = JetBrains Mono, teaching prose = Source Sans 3, titles = CMU
// Serif (the bundled lh-cmu @font-face in globals.css — no CDN).
const ui = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });
const prose = Source_Sans_3({ subsets: ["latin"], variable: "--font-sans3" });

export const metadata: Metadata = {
	title: "LearnHarness",
	description: "A teacher agent with a memory — sessions, quizzes, and a knowledge graph of what you know.",
	applicationName: "LearnHarness",
	appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "LearnHarness" },
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	viewportFit: "cover",
	themeColor: "#141414",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={`dark ${ui.variable} ${prose.variable}`}>
			<body className="min-h-dvh antialiased">
			{/* The notification channel and app chrome live in the frame so
				 the password login stays bare. */}
			<AppFrame>{children}</AppFrame>
			<PwaRegister />
			{/* Auto-update banner (Wave C): fixed card, Electron-only pushes. */}
			<UpdateBanner />
		</body>
		</html>
	);
}
