import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
	title: "Sign in · LearnHarness",
	robots: { index: false, follow: false },
};

export default async function LoginPage({
	searchParams,
}: {
	searchParams: Promise<{ next?: string }>;
}) {
	const params = await searchParams;
	return <LoginForm next={typeof params.next === "string" ? params.next : "/"} />;
}
