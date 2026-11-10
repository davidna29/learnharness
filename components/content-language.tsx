"use client";

/**
 * THE LESSON-LANGUAGE CHANNEL (clarify round, 2026-11-04): the settings
 * record's `general.contentLanguage` marks lesson prose for screen readers
 * and pronunciation. The app chrome stays English; only the content
 * surfaces that opt in (transcript, dock) read this context and set `lang`.
 *
 * The value is loaded once from /api/settings and refreshed when the
 * General section is saved (the shared settings signal). Factory default
 * is English, so the first paint is always valid.
 */

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { CONTENT_LANGUAGES, type ContentLanguage } from "@/src/core";
import { useSettingsSaved } from "@/components/settings-signal";

export const CONTENT_LANGUAGE_LABELS: Record<ContentLanguage, string> = {
	en: "English",
	id: "Indonesian",
	es: "Spanish",
	fr: "French",
	de: "German",
	pt: "Portuguese",
	it: "Italian",
	nl: "Dutch",
	ja: "Japanese",
	ko: "Korean",
	zh: "Chinese",
	ar: "Arabic",
	hi: "Hindi",
	ru: "Russian",
	tr: "Turkish",
	vi: "Vietnamese",
	th: "Thai",
};

interface ContentLanguageValue {
	language: ContentLanguage;
}

const ContentLanguageContext = createContext<ContentLanguageValue>({ language: "en" });

export function useContentLanguage(): ContentLanguage {
	return useContext(ContentLanguageContext).language;
}

export function ContentLanguageProvider({ children }: { children: React.ReactNode }) {
	const [language, setLanguage] = useState<ContentLanguage>("en");

	const load = useCallback(() => {
		void fetch("/api/settings", { cache: "no-store" })
			.then((res) => res.json() as Promise<{ settings?: { general?: { contentLanguage?: unknown } } | null }>)
			.then((body) => {
				const next = body.settings?.general?.contentLanguage;
				if (typeof next === "string" && (CONTENT_LANGUAGES as readonly string[]).includes(next)) {
					setLanguage(next as ContentLanguage);
				}
			})
			.catch(() => {
				/* keep the factory language */
			});
	}, []);

	useEffect(() => {
		load();
	}, [load]);

	useSettingsSaved((section) => {
		if (section === "general") load();
	});

	return <ContentLanguageContext.Provider value={{ language }}>{children}</ContentLanguageContext.Provider>;
}
