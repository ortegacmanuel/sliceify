import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  // Ignore build artifacts and deps
  {
    ignores: ['dist/**', 'node_modules/**'],
  },

  // Recommended JS rules
  js.configs.recommended,

  // Disable rules that conflict with Prettier formatting
  eslintConfigPrettier,

  // Project-wide settings
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        document: 'readonly',
        window: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
    },
  },
];
