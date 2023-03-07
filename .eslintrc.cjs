/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  ignorePatterns: ['.eslintrc.cjs', 'webpack.config.cjs'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', './webpack.config.js'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
        'plugin:prettier/recommended',
      ],
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        'no-empty': ['error', { allowEmptyCatch: true }],
        '@typescript-eslint/no-misused-promises': [
          'error',
          {
            checksConditionals: true,
            checksVoidReturn: false,
            checksSpreads: true,
          },
        ],
      },
    },
  ],
};
