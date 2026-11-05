#!/usr/bin/env node
/**
 * One-command LAN server: production build, loopback Next on 3100, HTTPS
 * via mkcert on 8443, password gate from `.env.local`. The phone talks
 * only to the HTTPS door; Next never binds the network interface.
 *
 *   npm run lan                 # build + serve
 *   npm run lan -- --no-build   # reuse the current production build
 *   npm run lan -- --init-auth  # create a random password in .env.local
 *   npm run lan -- --regen-cert # new mkcert certificate for the current IP
 */
import { spawn, spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { appendFileSync, chmodSync, cpSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { networkInterfaces, hostname as osHostname } from "node:os";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { get as httpGet } from "node:http";

const root = fileURLToPath(new URL("..", import.meta.url));
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const value = (name, fallback) => {
	const i = args.indexOf(name);
	return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const nextPort = Number(value("--next-port", 3100));
const httpsPort = Number(value("--https-port", 8443));
const envPath = join(root, ".env.local");
const certDir = join(root, ".certs");
const certPath = join(certDir, "lan.crt");
const keyPath = join(certDir, "lan.key");

function loadEnvFile() {
	if (!existsSync(envPath)) return;
	for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
		const match = /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)=(.*)$/.exec(line.trim());
		if (!match) continue;
		let raw = match[2].trim();
		if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) raw = raw.slice(1, -1);
		if (process.env[match[1]] === undefined) process.env[match[1]] = raw;
	}
}

function initAuth() {
	const missingPassword = !process.env.LH_ACCESS_PASSWORD;
	const missingSecret = !process.env.LH_SESSION_SECRET;
	if (!missingPassword && !missingSecret) return;
	if (!flag("--init-auth")) {
		console.error(
			"LAN auth is not configured.\n" +
			"Add these to .env.local (never commit it):\n" +
			"  LH_ACCESS_PASSWORD=<a long password>\n" +
			"  LH_SESSION_SECRET=<a random secret>\n" +
			"Or run: npm run lan -- --init-auth",
		);
		process.exit(1);
	}
	const password = missingPassword ? randomBytes(12).toString("base64url") : process.env.LH_ACCESS_PASSWORD;
	const secret = missingSecret ? randomBytes(32).toString("base64url") : process.env.LH_SESSION_SECRET;
	const prefix = existsSync(envPath) && readFileSync(envPath, "utf8").length > 0 ? "\n" : "";
	appendFileSync(envPath, `${prefix}LH_ACCESS_PASSWORD=${password}\nLH_SESSION_SECRET=${secret}\n`, { mode: 0o600 });
	chmodSync(envPath, 0o600);
	process.env.LH_ACCESS_PASSWORD = password;
	process.env.LH_SESSION_SECRET = secret;
	console.log("Generated LAN credentials in .env.local.");
	console.log(`Password: ${password}`);
	console.log("Store it somewhere safe; it is not printed again.\n");
}

function localHostName() {
	const result = spawnSync("scutil", ["--get", "LocalHostName"], { encoding: "utf8" });
	const name = (result.status === 0 ? result.stdout.trim() : "") || osHostname();
	return name.replace(/\.local$/i, "");
}

function lanAddress() {
	const nets = networkInterfaces();
	for (const name of ["en0", "en1"]) {
		for (const net of nets[name] ?? []) {
			if (net.family === "IPv4" && !net.internal) return net.address;
		}
	}
	for (const list of Object.values(nets)) {
		for (const net of list ?? []) {
			if (net.family === "IPv4" && !net.internal && !net.address.startsWith("169.254.")) return net.address;
		}
	}
	return null;
}

function portBusy(port) {
	const result = spawnSync("lsof", ["-nP", `-iTCP:${port}`, "-sTCP:LISTEN"], { encoding: "utf8" });
	return result.status === 0 && result.stdout.trim().length > 0;
}

function waitFor(url, attempts = 60) {
	return new Promise((resolve, reject) => {
		let left = attempts;
		const tick = () => {
			const request = httpGet(url, (res) => {
				res.resume();
				resolve(true);
			});
			request.on("error", () => {
				if (--left <= 0) reject(new Error(`timed out waiting for ${url}`));
				else setTimeout(tick, 500);
			});
			request.setTimeout(1000, () => request.destroy());
		};
		tick();
	});
}

loadEnvFile();
initAuth();

const mkcert = spawnSync("mkcert", ["-version"], { encoding: "utf8" });
if (mkcert.status !== 0) {
	console.error("mkcert is required for the phone's HTTPS origin.\nRun: brew install mkcert nss && mkcert -install");
	process.exit(1);
}

const local = localHostName();
const ip = lanAddress();
const hosts = ["localhost", "127.0.0.1", `${local}.local`, ...(ip ? [ip] : [])];

mkdirSync(certDir, { recursive: true });
if (flag("--regen-cert") || !existsSync(certPath) || !existsSync(keyPath)) {
	console.log(`Creating a certificate for ${hosts.join(", ")} …`);
	const made = spawnSync("mkcert", ["-cert-file", certPath, "-key-file", keyPath, ...hosts], { stdio: "inherit" });
	if (made.status !== 0) {
		console.error("mkcert could not create the certificate. Run `mkcert -install` once, then retry.");
		process.exit(1);
	}
}
const caRoot = spawnSync("mkcert", ["-CAROOT"], { encoding: "utf8" }).stdout.trim();

if (!flag("--no-build")) {
	console.log("Building the production server …");
	const build = spawnSync("npm", ["run", "build"], { cwd: root, stdio: "inherit", env: process.env });
	if (build.status !== 0) process.exit(build.status ?? 1);
}

for (const port of [nextPort, httpsPort]) {
	if (portBusy(port)) {
		console.error(`Port ${port} is already in use. Stop the dev server or pass --next-port/--https-port.`);
		process.exit(1);
	}
}

// The production build is standalone (Electron's target). Serve it the way
// Next documents instead of the unsupported `next start`: copy the static
// assets Next leaves outside the bundle and keep the repo data/auth paths.
const standalone = join(root, ".next", "standalone");
const standaloneServer = join(standalone, "server.js");
if (!existsSync(standaloneServer)) {
	console.error("Missing .next/standalone/server.js — run the build first.");
	process.exit(1);
}
const staticFrom = join(root, ".next", "static");
if (existsSync(staticFrom)) {
	cpSync(staticFrom, join(standalone, ".next", "static"), { recursive: true, force: true });
}
const publicFrom = join(root, "public");
if (existsSync(publicFrom)) {
	cpSync(publicFrom, join(standalone, "public"), { recursive: true, force: true });
}
const env = {
	...process.env,
	NODE_ENV: "production",
	PORT: String(nextPort),
	HOSTNAME: "127.0.0.1",
	LH_ACCESS_PASSWORD: process.env.LH_ACCESS_PASSWORD,
	LH_SESSION_SECRET: process.env.LH_SESSION_SECRET,
	LH_DATA_DIR: join(root, "data"),
	LH_AUTH_FILE: join(root, "auth.json"),
};
const next = spawn(process.execPath, [standaloneServer], {
	cwd: standalone,
	env,
	stdio: "inherit",
});

let tls;
let stopping = false;
function stop(code = 0) {
	if (stopping) return;
	stopping = true;
	tls?.kill("SIGTERM");
	next.kill("SIGTERM");
	setTimeout(() => process.exit(code), 300);
}
process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));
next.on("exit", (code) => {
	if (!stopping) {
		console.error(`Next exited (${code ?? "signal"}).`);
		stop(code ?? 1);
	}
});

try {
	await waitFor(`http://127.0.0.1:${nextPort}/`);
} catch (error) {
	console.error(error instanceof Error ? error.message : error);
	stop(1);
}

tls = spawn(process.execPath, [join(root, "scripts", "lan-tls.mjs")], {
	cwd: root,
	env: {
		...env,
		LH_TLS_CERT: certPath,
		LH_TLS_KEY: keyPath,
		LH_TLS_PORT: String(httpsPort),
		LH_NEXT_HOST: "127.0.0.1",
		LH_NEXT_PORT: String(nextPort),
	},
	stdio: "inherit",
});
tls.on("exit", (code) => {
	if (!stopping) {
		console.error(`TLS proxy exited (${code ?? "signal"}).`);
		stop(code ?? 1);
	}
});

console.log("");
console.log("LearnHarness LAN");
console.log(`  https://${local}.local:${httpsPort}`);
if (ip) console.log(`  https://${ip}:${httpsPort}`);
console.log("  Auth: password from .env.local");
console.log(`  Data: ${join(root, "data")}`);
console.log(`  CA:   ${join(caRoot, "rootCA.pem")} (install once on the phone)`);
console.log("  Stop: Ctrl+C");
console.log("");
