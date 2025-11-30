import dotenv from "dotenv";
dotenv.config();


import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";

if (!process.env.ARCJET_KEY) {
	throw new Error("ARCJET_KEY is missing in environment variables");
}

const aj = arcjet({
	key: process.env.ARCJET_ENV || "development",
	rules: [
		// Shield protects your app from common attacks e.g. SQL injection
		shield({ mode: "LIVE" }),
		// Create a bot detection rule
		detectBot({
			mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
			// Block all bots except the following
			allow: [
				"CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
			],
		}),
		// Create a token bucket rate limit. Other algorithms are supported.
		slidingWindow({
			mode: "LIVE",
			max: 100,
			interval: 60
		})
	],
});

export default aj;