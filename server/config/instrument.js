// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: "https://b5edae576b53ab0af05583fcace3b7eb@o4508945921671168.ingest.us.sentry.io/4508945930321920",
  integrations: [Sentry.mongooseIntegration()],
});