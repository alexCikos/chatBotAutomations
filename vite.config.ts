import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [sveltekit(), tailwindcss()],
  server: {
    watch: {
      ignored: ["**/db.json"], // ✅ Ignore db.json for hot reload
    },
  },
});
