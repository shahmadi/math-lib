import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      // Your custom rules here
    }
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: 2022
    }
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest  // Add Jest globals
      }
    }
  },
  // Test-specific configuration
  {
    files: ["**/*.test.js", "**/test/**/*.js"],  // Apply to all test files
    languageOptions: {
      globals: globals.jest  // Explicitly add Jest globals for test files
    }
  }
]);