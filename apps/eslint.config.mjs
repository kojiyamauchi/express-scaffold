import esLintJs from '@eslint/js'
import typeScriptParser from '@typescript-eslint/parser'
import esLintConfigPrettier from 'eslint-config-prettier'
import pluginImport from 'eslint-plugin-import'
import pluginJest from 'eslint-plugin-jest'
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import typeScriptESLint from 'typescript-eslint'

const __dirname = import.meta.dirname
const typeScriptESLintConfigBase = typeScriptESLint.configs.base
const typeScriptESLintConfigESLintRecommended = typeScriptESLint.configs.eslintRecommended
const typeScriptESLintConfigRecommended = typeScriptESLint.configs.recommended.find((recommended) => {
  if (recommended.name === 'typescript-eslint/recommended') {
    return recommended
  }
})

export default [
  esLintConfigPrettier,
  {
    name: 'for typescript',
    files: ['**/*.ts'],
    ignores: [],
    languageOptions: {
      ...typeScriptESLintConfigBase.languageOptions,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es6,
        ...globals.jest,
      },
      parser: typeScriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
          impliedStrict: true,
        },
        tsconfigRootDir: __dirname,
        project: './tsconfig.json',
      },
    },
    plugins: {
      ...typeScriptESLintConfigBase.plugins,
      import: pluginImport,
      jest: pluginJest,
      'simple-import-sort': pluginSimpleImportSort,
    },
    settings: {
      'import/resolver': {
        webpack: {
          config: 'webpack/webpack.base.mjs',
        },
      },
      node: {
        tryExtensions: ['.js', '.ts', '.json', '.node'],
      },
    },
    rules: {
      ...typeScriptESLintConfigESLintRecommended.rules,
      ...typeScriptESLintConfigRecommended.rules,
      indent: 'off',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/member-delimiter-style': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/prefer-interface': 'off',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
      'max-classes-per-file': ['error', 2],
      'no-bitwise': [
        'error',
        {
          allow: ['~'],
        },
      ],
      'import/order': 'off',
      'sort-keys': 'off',
      'no-multiple-empty-lines': 'off',
      'lines-between-class-members': [
        'error',
        'always',
        {
          exceptAfterSingleLine: true,
        },
      ],
      'no-console': ['warn', { allow: ['info', 'error'] }],
      'unicorn/number-literal-case': 'off',
      'spaced-comment': ['error', 'always'],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    name: 'for mjs',
    files: ['**/*.mjs'],
    ignores: [],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es6,
        ...globals.jest,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      import: pluginImport,
      'simple-import-sort': pluginSimpleImportSort,
    },
    rules: {
      ...esLintJs.configs.recommended.rules,
      indent: 'off',
      'max-classes-per-file': ['error', 2],
      'no-bitwise': [
        'error',
        {
          allow: ['~'],
        },
      ],
      'import/order': 'off',
      'sort-keys': 'off',
      'no-multiple-empty-lines': 'off',
      'lines-between-class-members': [
        'error',
        'always',
        {
          exceptAfterSingleLine: true,
        },
      ],
      'no-console': ['warn', { allow: ['info', 'error'] }],
      'unicorn/number-literal-case': 'off',
      'spaced-comment': ['error', 'always'],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    name: 'for js',
    files: ['**/*.js'],
    ignores: ['build/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es6,
        ...globals.jest,
      },
    },
  },
]
