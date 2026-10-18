import { type Config } from "drizzle-kit";
import { env } from "~/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "singlestore",
   dbCredentials: {
    host: env.SINGLESTORE_HOST,
    port: env.SINGLESTORE_PORT,
    user: env.SINGLESTORE_USERNAME,
    password: env.SINGLESTORE_PASS,
    database: env.SINGLESTORE_DB_NAME,
    ssl: {},
  },
  tablesFilter: ["drive-tutorial_*"],
} satisfies Config;
