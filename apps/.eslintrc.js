// Currently, when using .eslintrc.yml in the case of monorepo ".vscode.setting.json.eslint.workingDirectories" is dose not work.
// It needs to be "tsconfigRootDir: __dirname", but it's not available in yml. (Node.js API)
// https://github.com/microsoft/vscode-eslint/issues/1170

module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    'jest/globals': true
  },
  globals: {
    page: true,
    browser: true,
    jestPuppeteer: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'import', 'jest', 'simple-import-sort'],
  settings: {
    node: {
      tryExtensions: ['.js', '.ts', '.json', '.node']
    }
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    indent: 'off',
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
        varsIgnorePattern: '^AddIgnoreVariables'
      }
    ],
    '@typescript-eslint/no-implicit-any-catch': [
      'error',
      {
        allowExplicitAny: true
      }
    ],
    'max-classes-per-file': ['error', 2],
    'no-bitwise': [
      'error',
      {
        allow: ['~']
      }
    ],
    'import/order': 'off',
    'sort-keys': 'off',
    'no-multiple-empty-lines': 'off',
    'lines-between-class-members': [
      'error',
      'always',
      {
        exceptAfterSingleLine: true
      }
    ],
    'no-console': 'off',
    'unicorn/number-literal-case': 'off',
    'spaced-comment': ['error', 'always'],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    '@typescript-eslint/ban-ts-comment': 'error'
  }
}
