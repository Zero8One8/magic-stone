import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-dropdown-menu', '@radix-ui/react-collapsible'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-form': ['react-hook-form', 'zod', '@hookform/resolvers'],
          'vendor-other': ['clsx', 'class-variance-authority', 'tailwind-merge'],
          // Page chunks - critical pages separate from less-used ones
          'page-catalog': ['./src/pages/Catalog.tsx', './src/pages/CrystalDetail.tsx'],
          'page-blog': ['./src/pages/Blog.tsx', './src/pages/BlogArticle.tsx'],
          'page-tools': ['./src/pages/Quiz.tsx', './src/pages/MoonCalendar.tsx', './src/pages/ChakraMap.tsx'],
        },
      },
    },
  },
}));
