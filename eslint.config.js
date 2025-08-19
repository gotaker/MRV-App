// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import templateParser from '@angular-eslint/template-parser';

export default tseslint.config(
  // Flat config replaces .eslintignore
  { ignores: ['**/dist/**', '**/node_modules/**', 'coverage/**'] },

  // TypeScript sources (and inline templates via processor)
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended, // Angular TS recommended
    ],
    processor: angular.processInlineTemplates, // lint inline templates
    languageOptions: {
      parserOptions: {
        project: ['tsconfig.json'],
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    // keep your selector conventions
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
    },
  },

  // External HTML templates
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended], // Angular template recommended
    languageOptions: { parser: templateParser },
  },
);
// AngularJS sources
