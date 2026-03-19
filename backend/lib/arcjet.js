import arcjet, { shield, fixedWindow } from "@arcjet/node";

// Fail open if ARCJET_KEY isn't set (local/dev or misconfigured env)
const arcjetKey = process.env.ARCJET_KEY;

export const aj = arcjetKey
  ? arcjet({
      key: arcjetKey,
      characteristics: ["ip.src"], // Track requests by IP address
      rules: [
        shield({
          mode: process.env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
        }),
        fixedWindow({
          mode: "LIVE", // Generally safe even in development
          characteristics: ["ip.src"],
          window: "1m",
          max: 10,
        }),
      ],
    })
  : null;
