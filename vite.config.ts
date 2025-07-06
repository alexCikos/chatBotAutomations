import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [sveltekit(), tailwindcss()],
  server: {
    watch: {
      ignored: ["**/messages.json", "**/chats.json"], // ✅ Ignore db.json for hot reload
    },
  },
});
