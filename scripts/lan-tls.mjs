#!/usr/bin/env node
/**
 * The LAN HTTPS door: terminates TLS with the mkcert certificate and
 * streams every request to the loopback Next server. No buffering (SSE),
 * no WebSocket upgrade (the production app uses none); the public Host and
 * x-forwarded-proto are forwarded so redirects and Secure cookies stay on
 * the phone's origin.
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:https";
import { request as httpRequest } from "node:http";

const certPath = process.env.LH_TLS_CERT;
const keyPath = process.env.LH_TLS_KEY;
const nextHost = process.env.LH_NEXT_HOST ?? "127.0.0.1";
const nextPort = Number(process.env.LH_NEXT_PORT ?? 3100);
const tlsPort = Number(process.env.LH_TLS_PORT ?? 8443);

if (!certPath || !keyPath) {
	console.error("[lan-tls] LH_TLS_CERT and LH_TLS_KEY are required.");
	process.exit(1);
}

const server = createServer(
	{ cert: readFileSync(certPath), key: readFileSync(keyPath) },
	(req, res) => {
		const headers = { ...req.headers };
		delete headers["proxy-connection"];
		const host = req.headers.host;
		if (host) {
			headers.host = host;
			headers["x-forwarded-host"] = host;
		}
		headers["x-forwarded-proto"] = "https";
		const remote = req.socket.remoteAddress;
		if (remote) {
			headers["x-forwarded-for"] = req.headers["x-forwarded-for"]
				? `${req.headers["x-forwarded-for"]}, ${remote}`
				: remote;
		}

		const upstream = httpRequest(
			{ host: nextHost, port: nextPort, method: req.method, path: req.url, headers },
			(up) => {
				res.writeHead(up.statusCode ?? 502, up.headers);
				res.flushHeaders();
				up.pipe(res);
			},
		);
		upstream.on("error", (error) => {
			if (!res.headersSent) {
				res.writeHead(502, { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" });
			}
			res.end(`Upstream error: ${error.message}`);
		});
		req.on("aborted", () => upstream.destroy());
		req.pipe(upstream);
	},
);

server.headersTimeout = 0;
server.requestTimeout = 0;
server.keepAliveTimeout = 65_000;
server.on("clientError", (_error, socket) => {
	if (socket.writable) socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});
server.listen(tlsPort, "0.0.0.0", () => {
	console.log(`[lan-tls] https://0.0.0.0:${tlsPort} -> http://${nextHost}:${nextPort}`);
});
