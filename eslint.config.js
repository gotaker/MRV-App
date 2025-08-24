import angularPlugin from "@angular-eslint/eslint-plugin";
import angularTemplate from "@angular-eslint/eslint-plugin-template";
import * as tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default [
  ...angularPlugin.configs["flat/recommended"],
  ...angularTemplate.configs["flat/recommended"],
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: false,
        sourceType: "module",
        ecmaVersion: "latest"
      }
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn"
    }
  },
  {
    files: ["**/*.html"],
    rules: {}
  }
];
