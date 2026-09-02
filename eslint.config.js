import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'public/vendor/**', '.worktrees/**']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    files: ['vitest.config.js', 'playwright.config.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['src/**/*.jsx'],
    rules: {
      'no-restricted-syntax': ['error', {
        selector: 'JSXAttribute[name.name="style"]',
        message: 'React inline styles are forbidden by the production Content Security Policy.',
      }],
    },
  },
])
