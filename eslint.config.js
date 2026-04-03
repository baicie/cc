import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import react from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

const customRules = {
  'bootstrap-isolation': { meta: { type: 'problem', docs: { description: 'Bootstrap isolation', recommended: false }, schema: [] }, create() { return {}; } },
  'no-cross-platform-process-issues': { meta: { type: 'problem', docs: { description: 'No cross platform process issues', recommended: false }, schema: [] }, create() { return {}; } },
  'no-direct-json-operations': { meta: { type: 'problem', docs: { description: 'No direct JSON operations', recommended: false }, schema: [] }, create() { return {}; } },
  'no-direct-ps-commands': { meta: { type: 'problem', docs: { description: 'No direct PS commands', recommended: false }, schema: [] }, create() { return {}; } },
  'no-lookbehind-regex': { meta: { type: 'problem', docs: { description: 'No lookbehind regex', recommended: false }, schema: [] }, create() { return {}; } },
  'no-process-cwd': { meta: { type: 'problem', docs: { description: 'No process cwd', recommended: false }, schema: [] }, create() { return {}; } },
  'no-process-env-top-level': { meta: { type: 'problem', docs: { description: 'No process env top level', recommended: false }, schema: [] }, create() { return {}; } },
  'no-process-exit': { meta: { type: 'problem', docs: { description: 'No process exit', recommended: false }, schema: [] }, create() { return {}; } },
  'no-sync-fs': { meta: { type: 'problem', docs: { description: 'No sync FS', recommended: false }, schema: [] }, create() { return {}; } },
  'no-top-level-dynamic-import': { meta: { type: 'problem', docs: { description: 'No top level dynamic import', recommended: false }, schema: [] }, create() { return {}; } },
  'no-top-level-side-effects': { meta: { type: 'problem', docs: { description: 'No top level side effects', recommended: false }, schema: [] }, create() { return {}; } },
  'prefer-use-keybindings': { meta: { type: 'problem', docs: { description: 'Prefer use keybindings', recommended: false }, schema: [] }, create() { return {}; } },
  'prefer-use-terminal-size': { meta: { type: 'problem', docs: { description: 'Prefer use terminal size', recommended: false }, schema: [] }, create() { return {}; } },
  'prompt-spacing': { meta: { type: 'problem', docs: { description: 'Prompt spacing', recommended: false }, schema: [] }, create() { return {}; } },
  'require-bun-typeof-guard': { meta: { type: 'problem', docs: { description: 'Require bun typeof guard', recommended: false }, schema: [] }, create() { return {}; } },
  'require-tool-match-name': { meta: { type: 'problem', docs: { description: 'Require tool match name', recommended: false }, schema: [] }, create() { return {}; } },
  'safe-env-boolean-check': { meta: { type: 'problem', docs: { description: 'Safe env boolean check', recommended: false }, schema: [] }, create() { return {}; } },
};

const customPlugin = {
  name: 'custom-rules',
  rules: customRules,
};

export default [
  {
    ignores: ['dist/**', 'node_modules/**', '**/*.js', 'pnpm-lock.yaml'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooks,
      react,
      'jsx-a11y': jsxA11y,
      prettier,
      'custom-rules': customPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      ...prettierConfig.rules,
      'prettier/prettier': 'error',

      // Disable custom rules (they are defined elsewhere by Biome)
      'custom-rules/bootstrap-isolation': 'off',
      'custom-rules/no-cross-platform-process-issues': 'off',
      'custom-rules/no-direct-json-operations': 'off',
      'custom-rules/no-direct-ps-commands': 'off',
      'custom-rules/no-lookbehind-regex': 'off',
      'custom-rules/no-process-cwd': 'off',
      'custom-rules/no-process-env-top-level': 'off',
      'custom-rules/no-process-exit': 'off',
      'custom-rules/no-sync-fs': 'off',
      'custom-rules/no-top-level-dynamic-import': 'off',
      'custom-rules/no-top-level-side-effects': 'off',
      'custom-rules/prefer-use-keybindings': 'off',
      'custom-rules/prefer-use-terminal-size': 'off',
      'custom-rules/prompt-spacing': 'off',
      'custom-rules/require-bun-typeof-guard': 'off',
      'custom-rules/require-tool-match-name': 'off',
      'custom-rules/safe-env-boolean-check': 'off',

      // TypeScript specific
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',

      // React
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      // JSX a11y
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-has-content': 'warn',
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-proptypes': 'warn',
      'jsx-a11y/aria-unsupported-elements': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/heading-has-content': 'warn',
      'jsx-a11y/html-has-lang': 'warn',
      'jsx-a11y/img-redundant-alt': 'warn',
      'jsx-a11y/interactive-supports-focus': 'warn',
      'jsx-a11y/label-has-associated-control': 'warn',
      'jsx-a11y/mouse-events-have-key-events': 'warn',
      'jsx-a11y/no-autofocus': 'warn',
      'jsx-a11y/no-distracting-elements': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      'jsx-a11y/no-noninteractive-tabindex': 'warn',
      'jsx-a11y/no-redundant-roles': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'jsx-a11y/role-supports-aria-props': 'warn',
      'jsx-a11y/scope': 'warn',
      'jsx-a11y/tabindex-no-positive': 'warn',

      // Prettier
      'prettier/prettier': ['error', {
        singleQuote: true,
        semi: true,
        trailingComma: 'all',
        printWidth: 100,
      }],
    },
  },
  {
    files: ['**/*.tsx'],
    rules: {
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
];
