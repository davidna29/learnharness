import assert from "node:assert/strict";
import { test } from "node:test";
import {
	createLanSession,
	lanAccessEnabled,
	lanPasswordMatches,
	safeReturnPath,
	verifyLanSession,
} from "../src/server/lan-auth.ts";

const env = { LH_ACCESS_PASSWORD: "correct horse battery staple", LH_SESSION_SECRET: "test-secret" };

test("the LAN gate is off until a password is configured", () => {
	assert.equal(lanAccessEnabled({}), false);
	assert.equal(lanAccessEnabled({ LH_ACCESS_PASSWORD: "" }), false);
	assert.equal(lanAccessEnabled(env), true);
});

test("password comparison is exact and rejects non-strings", () => {
	assert.equal(lanPasswordMatches(env.LH_ACCESS_PASSWORD, env), true);
	assert.equal(lanPasswordMatches("wrong", env), false);
	assert.equal(lanPasswordMatches(undefined, env), false);
	assert.equal(lanPasswordMatches("", env), false);
});

test("session tokens verify until expiry and reject tampering", () => {
	const now = 1_000_000;
	const { token } = createLanSession(env, now);
	assert.equal(verifyLanSession(token, env, now + 1_000), true);
	assert.equal(verifyLanSession(token, env, now + 31 * 24 * 60 * 60 * 1000), false);
	assert.equal(verifyLanSession(token.replace(/.$/, "x"), env, now + 1_000), false);
	assert.equal(verifyLanSession(token, { ...env, LH_SESSION_SECRET: "other" }, now + 1_000), false);
	assert.equal(verifyLanSession(undefined, env, now), false);
});

test("return paths stay on the same site", () => {
	assert.equal(safeReturnPath("/chat/1"), "/chat/1");
	assert.equal(safeReturnPath("/login?next=/chat/1"), "/login?next=/chat/1");
	for (const value of ["//evil.example", "https://evil.example", "\\\\evil", "", null, undefined]) {
		assert.equal(safeReturnPath(value as string | null | undefined), "/");
	}
});
