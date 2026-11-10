"use client";

import { useCallback, useEffect, useLayoutEffect, type RefObject } from "react";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** The dock may claim at most 55% of the viewport (dvh, measured from the
 * live window) and must always leave 16rem of transcript above it — the
 * reading surface is the product (critique round, 2026-11-04). */
const DOCK_VIEWPORT_FRACTION = 0.55;
const TRANSCRIPT_RESERVE = 16 * 16;

export interface DockHeightMeasurements {
	columnHeight: number;
	/** Stats/toolbar and block padding, outside the scrolling viewport. */
	outsideHeight: number;
	/** Everything in the viewport except the animated shell. */
	beforeShellHeight: number;
	shellBorderHeight: number;
	/** Natural content height, not the shell's animated/clamped height. */
	contentHeight: number;
	/** Null when collapsed, in chat mode, or showing malformed input. */
	questionHeight: number | null;
	questionPaddingHeight: number;
	/** Optional ceiling for the whole dock block (viewport + toolbar).
	 *  Absent in unit callers that test the column arithmetic alone. */
	maxBlockHeight?: number;
}

/** The whole-dock ceiling: min(55dvh, column − 16rem), with a 320px
 *  usable floor for short windows (never more than the column allows). */
export function dockBlockCap(columnHeight: number, viewportHeight: number): number {
	const dvh = viewportHeight > 0 ? Math.round(viewportHeight * DOCK_VIEWPORT_FRACTION) : Number.POSITIVE_INFINITY;
	const columnCap = Math.max(columnHeight - TRANSCRIPT_RESERVE, 0);
	const minUsable = Math.min(Math.max(columnHeight - 32, 0), 320);
	return Math.max(Math.min(dvh, columnCap), minUsable);
}

export function dockHeightBudget(m: DockHeightMeasurements) {
	const available = Math.max(Math.min(m.columnHeight - 32, m.maxBlockHeight ?? m.columnHeight - 32), 0);
	const viewportMaxHeight = Math.max(available - m.outsideHeight, 0);
	const shellMaxHeight = Math.max(viewportMaxHeight - m.beforeShellHeight, 0);
	const naturalHeight = m.beforeShellHeight + m.shellBorderHeight + m.contentHeight;
	const questionMaxHeight = m.questionHeight === null
		? null
		: Math.max(viewportMaxHeight - (naturalHeight - m.questionHeight), 0);
	// A cap smaller than the question's padding leaves no content viewport.
	// Deliberately uncap the question and scroll the whole content instead;
	// do not confuse a measured zero with an unmeasured CSS fallback.
	const scrollWholeContent = questionMaxHeight === null
		? naturalHeight > viewportMaxHeight
		: questionMaxHeight <= m.questionPaddingHeight;
	return { viewportMaxHeight, shellMaxHeight, questionMaxHeight, scrollWholeContent };
}

interface DockHeightElements {
	column: HTMLElement;
	block: HTMLElement;
	viewport: HTMLElement;
	body: HTMLElement;
	shell: HTMLElement;
	content: HTMLElement;
}

const pixels = (value: string) => Number.parseFloat(value) || 0;

/** Read natural geometry before writing any constraints. Cancel the shell's
 * animated height out of both ancestor measurements, then substitute its
 * natural content and borders. This stays valid during a WAAPI height morph
 * and when the outer viewport is already capped. */
export function syncDockHeight(elements: DockHeightElements, expanded: boolean) {
	const { column, block, viewport, body, shell, content } = elements;
	// QuestionDock keeps a laid-out form in an invisible h-0 wrapper;
	// PracticeDock removes its form. Neither hidden form is a height input.
	const question = expanded ? content.querySelector<HTMLElement>("[data-dock-scroll-area]") : null;
	const height = (el: HTMLElement) => el.getBoundingClientRect().height;
	const shellStyle = getComputedStyle(shell);
	const questionStyle = question ? getComputedStyle(question) : null;
	// The whole dock (viewport + stats toolbar) is capped by the smaller of
	// 55dvh and the column minus a 16rem transcript reserve. The gradient
	// above the block is a fade, not dock chrome, and stays outside this cap.
	const maxBlockHeight = dockBlockCap(column.clientHeight, window.innerHeight);
	const budget = dockHeightBudget({
		columnHeight: column.clientHeight,
		maxBlockHeight,
		outsideHeight: Math.max(height(block) - height(viewport), 0),
		beforeShellHeight: Math.max(height(body) - height(shell), 0),
		shellBorderHeight: pixels(shellStyle.borderTopWidth) + pixels(shellStyle.borderBottomWidth),
		contentHeight: height(content),
		questionHeight: question ? height(question) : null,
		questionPaddingHeight: questionStyle
			? pixels(questionStyle.paddingTop) + pixels(questionStyle.paddingBottom)
			: 0,
	});
	if (budget.questionMaxHeight === null) block.style.removeProperty("--dock-max-h");
	else block.style.setProperty("--dock-max-h", budget.scrollWholeContent ? "none" : `${budget.questionMaxHeight}px`);
	viewport.style.maxHeight = `${budget.viewportMaxHeight}px`;
	// Overflow is visible in normal layouts: keep the shell's shadow intact.
	// The stats/model toolbar is a sibling, never inside this overflow box.
	viewport.style.overflowY = budget.scrollWholeContent ? "auto" : "visible";
	// Clamp animated starting heights too, so a previous tall variant cannot
	// paint above the column while morphing into a constrained layout.
	shell.style.maxHeight = budget.scrollWholeContent ? "none" : `${budget.shellMaxHeight}px`;
	return budget;
}

interface DockHeightRefs {
	scrollRef: RefObject<HTMLElement | null>;
	blockRef: RefObject<HTMLDivElement | null>;
	viewportRef: RefObject<HTMLDivElement | null>;
	bodyRef: RefObject<HTMLDivElement | null>;
	shellRef: RefObject<HTMLDivElement | null>;
	contentRef: RefObject<HTMLDivElement | null>;
}

export function useDockHeight({
	scrollRef, blockRef, viewportRef, bodyRef, shellRef, contentRef,
	expanded, enabled, mode, onScrollbarInset, onHeight,
}: DockHeightRefs & {
	expanded: boolean;
	enabled: boolean;
	/** Reconnect observers when the keyed content node/scroll area changes. */
	mode: string;
	onScrollbarInset: (inset: number) => void;
	/** Settled visible block height, fed through the existing reserve policy. */
	onHeight: (height: number) => void;
}) {
	const measure = useCallback(() => {
		const column = scrollRef.current;
		const block = blockRef.current;
		const viewport = viewportRef.current;
		const body = bodyRef.current;
		const shell = shellRef.current;
		const content = contentRef.current;
		if (!column || !block || !viewport || !body || !shell || !content) return;
		onScrollbarInset(Math.round((column.offsetWidth - column.clientWidth) / 2));
		if (enabled) syncDockHeight({ column, block, viewport, body, shell, content }, expanded);
		else {
			block.style.removeProperty("--dock-max-h");
			viewport.style.removeProperty("max-height");
			viewport.style.removeProperty("overflow-y");
			shell.style.removeProperty("max-height");
		}
		// ResizeObserver runs even when only a child field changed and React
		// did not rerender DockOverlay. Keep its transcript reserve current,
		// but never report a mid-morph height.
		if (shell.getAnimations().length === 0) onHeight(block.getBoundingClientRect().height);
	}, [scrollRef, blockRef, viewportRef, bodyRef, shellRef, contentRef, expanded, enabled, onScrollbarInset, onHeight]);

	// Imperative constraints land before the overlay's later layout effect
	// measures its morph target/reserve, and before paint (including reveal).
	useIsoLayoutEffect(measure);
	useIsoLayoutEffect(() => {
		const observer = new ResizeObserver(measure);
		for (const el of [scrollRef.current, blockRef.current, viewportRef.current, bodyRef.current, contentRef.current]) {
			if (el) observer.observe(el);
		}
		const question = expanded ? contentRef.current?.querySelector("[data-dock-scroll-area]") : null;
		if (question) observer.observe(question);
		window.addEventListener("resize", measure);
		return () => {
			observer.disconnect();
			window.removeEventListener("resize", measure);
		};
	}, [measure, mode, expanded, scrollRef, blockRef, viewportRef, bodyRef, contentRef]);
}

/** Overlay and transcript are siblings. Keep native scrolling in an actual
 * scroll container (including the short-window viewport), then forward only
 * at its edge. overflow:hidden/visible boxes cannot consume the wheel. */
export function forwardDockWheel(event: WheelEvent, root: HTMLElement, transcript: HTMLElement) {
	if (event.deltaY === 0) return;
	for (let n = event.target as HTMLElement | null; n && n !== root; n = n.parentElement) {
		if (!(n instanceof HTMLElement) || !/^(auto|scroll)$/.test(getComputedStyle(n).overflowY)) continue;
		if (n.scrollHeight - n.clientHeight < 2) continue;
		if (event.deltaY < 0 ? n.scrollTop > 0 : n.scrollTop < n.scrollHeight - n.clientHeight - 0.5) return;
	}
	event.preventDefault();
	transcript.scrollTop += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? transcript.clientHeight : 1);
}
