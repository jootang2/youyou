import { config } from "dotenv";
config({ path: ".env.local" });
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // migrate/db push는 session mode 직접 연결 사용 (pgbouncer 우회)
    url: process.env["DIRECT_URL"]!,
  },
});
