// @ts-check
import { configs as angular } from "@angular-eslint/eslint-plugin";
import angularTemplate from "@angular-eslint/eslint-plugin-template";
import parser from "@angular-eslint/template-parser";
export default [
  ...angular["all"],
  {
    files: ["**/*.ts"],
    languageOptions: { parserOptions: { project: ["tsconfig.json"], ecmaVersion: "latest", sourceType: "module" } },
    rules: {
      "@angular-eslint/directive-selector": ["error", { type: "attribute", prefix: "app", style: "camelCase" }],
      "@angular-eslint/component-selector": ["error", { type: "element", prefix: "app", style: "kebab-case" }]
    }
  },
  {
    files: ["**/*.html"],
    plugins: { "@angular-eslint/template": angularTemplate },
    languageOptions: { parser },
    rules: { "@angular-eslint/template/accessible-name": "warn" }
  }
];
