import "dotenv/config";
import { defineConfig } from "@prisma/config";

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL as string, // Tambahkan 'as string' untuk menghindari error undefined di strict mode
  },
});
