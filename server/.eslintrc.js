module.exports = {
  env: {
    commonjs: true,
    es2025: true,
    node: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'linebreak-style': 0,
    'object-curly-newline': 0,
    'no-console': 0,
    'no-restricted-syntax': 0,
    'no-plusplus': 0,
  },
};
