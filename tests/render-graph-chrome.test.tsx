/**
 * Empty-graph chrome pins (empty-graph chrome wave, owner 2026-09-25):
 * Import Notes renders ALWAYS — the one action that works on an empty
 * graph, the entry point itself; search + settings render only when the
 * snapshot has nodes (dead controls are lies — the honesty principle).
 * GraphChromeRow is the pure seam (the DeleteNodeBody pattern): SSR of
 * both states pins the ruling. Fetches don't run under renderToStaticMarkup
 * (effects never fire), so these pins exercise the component directly.
 */

import React from "react";
(globalThis as Record<string, unknown>).React = React;

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { GraphChromeRow, GraphView } from "../components/graph-view.tsx";
import type { GraphRenderSettings } from "../components/graph-canvas.ts";
import { ServerEventsProvider } from "../components/server-events.tsx";

/** Ref doubles — the SSR harness never attaches them. */
const ref = { current: null };

const PROPS = {
	query: "",
	onQuery: () => {},
	noMatch: false,
	importing: false,
	searchInputRef: ref,
	onImportFiles: () => {},
	settings: {} as GraphRenderSettings,
	changeSettings: () => {},
	onOpenChains: () => {},
};

describe("GraphChromeRow — the empty-graph ruling (owner, 2026-09-25)", () => {
	it("EMPTY graph: Import and source inventory render; canvas search/settings stay absent", () => {
		const html = renderToStaticMarkup(createElement(GraphChromeRow, { ...PROPS, isEmpty: true }));
		assert.ok(html.includes('data-testid="import-notes"'));
		assert.ok(html.includes("Import notes…"));
		assert.ok(html.includes("lucide-upload"));
		assert.ok(!html.includes("lucide-waypoints"));
		assert.ok(!html.includes("Search nodes…"), "search is a lie on an empty graph");
		// the settings gear is the lucide-settings svg (tooltip wave: its old
		// native title is gone — the styled tooltip carries the label now)
		assert.ok(!html.includes("lucide-settings"), "settings is a lie on an empty graph");
		assert.ok(html.includes('data-testid="open-chain-table"'), "source inventory includes chats/files without graph nodes");
		assert.equal(html.split("graph-chrome-fade-in").length - 1, 1, "only the inventory button has the appearance animation");
	});

	it("empty graph leads with sessions or notes import (paperclip guidance is desktop-only)", () => {
		const html = renderToStaticMarkup(createElement(ServerEventsProvider, { children: createElement(GraphView, {}) }));
		assert.ok(html.includes("<p>Start a session or import notes to build your graph.</p>"));
		assert.ok(!html.includes("paperclip"));
	});

	it("POPULATED graph: all four render, the gated trio carries the fade", () => {
		const html = renderToStaticMarkup(createElement(GraphChromeRow, { ...PROPS, isEmpty: false }));
		assert.ok(html.includes('data-testid="import-notes"'));
		assert.ok(html.includes("Search nodes…"));
		assert.ok(html.includes("lucide-settings"), "the settings gear renders");
		assert.ok(html.includes('data-testid="open-chain-table"'), "the chains entry renders");
		// the appear-once fade rides exactly the three gated controls, never Import Notes
		assert.equal(html.split("graph-chrome-fade-in").length - 1, 3, "three fade carriers: search + chains + settings");
	});

	it("the no-match note renders only when the wrapper says so (its truth stays upstream)", () => {
		const html = renderToStaticMarkup(
			createElement(GraphChromeRow, { ...PROPS, isEmpty: false, query: "zzz", noMatch: true }),
		);
		assert.ok(html.includes("No matching nodes."));
		const quiet = renderToStaticMarkup(
			createElement(GraphChromeRow, { ...PROPS, isEmpty: false, query: "zzz", noMatch: false }),
		);
		assert.ok(!quiet.includes("No matching nodes."));
	});
});

describe("GraphChromeRow — the mobile chrome (graph round, 2026-11-06)", () => {
	it("search collapses to an icon toggle on narrow screens — and only on a populated graph", () => {
		const populated = renderToStaticMarkup(createElement(GraphChromeRow, { ...PROPS, isEmpty: false }));
		assert.ok(populated.includes('data-testid="graph-search-toggle"'), "the toggle renders with nodes");
		// the trailing sm:hidden (spaced, not max-sm:) lives on the toggle
		// alone — desktop keeps the inline box untouched
		assert.ok(populated.includes("hover:text-foreground sm:hidden"), "the toggle is narrow-screen-only");
		const empty = renderToStaticMarkup(createElement(GraphChromeRow, { ...PROPS, isEmpty: true }));
		assert.ok(!empty.includes('data-testid="graph-search-toggle"'), "no toggle on an empty graph (honesty)");
	});

	it("uncontrolled search defaults closed; the controlled prop opens the panel (⌘K on narrow screens)", () => {
		const closed = renderToStaticMarkup(createElement(GraphChromeRow, { ...PROPS, isEmpty: false }));
		assert.ok(closed.includes('aria-expanded="false"'), "the toggle starts collapsed");
		assert.ok(closed.includes('data-testid="graph-search-panel"'), "the panel seam exists");
		const open = renderToStaticMarkup(
			createElement(GraphChromeRow, { ...PROPS, isEmpty: false, mobileSearchOpen: true }),
		);
		assert.ok(open.includes('aria-expanded="true"'), "controlled open reaches the toggle");
		assert.ok(open.includes("max-sm:absolute"), "the panel drops full-width under the row, not over the canvas");
	});

	it("the settings gear is touch-sized with a full hit area (the sheet itself opens on tap — browser-verified)", () => {
		const html = renderToStaticMarkup(createElement(GraphChromeRow, { ...PROPS, isEmpty: false }));
		assert.ok(html.includes('aria-label="Graph display settings"'), "the gear renders on a populated graph");
		// size-9 trigger + ::after hit-area extension: tappable without
		// stealing row space; the panel it opens is a max-sm:fixed bottom
		// sheet (graph-view.tsx GraphSettingsControl — visible only when
		// open, so pinned in the browser, not SSR)
		assert.ok(html.includes("size-9"), "the gear meets the 36px touch floor");
		assert.ok(html.includes("after:-inset-1.5"), "the full hit area rides the trigger");
	});
});