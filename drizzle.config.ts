import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.POSTGRES_URL,
  },
  /** Only manage objects inside the `resurexi` Postgres schema. */
  schemaFilter: ["resurexi"],
  /** Table name prefix within that schema. */
  tablesFilter: ["_resurexi_*"],
} satisfies Config;
