import arcjet, { shield } from "@arcjet/node";

// Fail open if ARCJET_KEY isn't set (local/dev or misconfigured env)
const arcjetKey = process.env.ARCJET_KEY;

export const aj = arcjetKey
  ? arcjet({
      key: arcjetKey,
      rules: [
        shield({
          mode: process.env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
        }),
      ],
    })
  : null;

