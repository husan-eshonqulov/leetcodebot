import eslint from "@eslint/js";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    files: ["**/*.{js,cjs,mjs}"],
    extends: [tseslint.configs.disableTypeChecked]
  },
  {
    plugins: {
      "simple-import-sort": simpleImportSort
    }
  },
  {
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error"
    }
  }
);
