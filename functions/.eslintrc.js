module.exports = {
  root: true,
  ignorePatterns: ["../*", "*.js"],
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  extends: ["eslint:recommended", "google"],
  rules: {
    "linebreak-style": 0,
    "object-curly-spacing": ["error", "always"],
    "indent": ["error", 2],
    "max-len": "off",
    "comma-dangle": ["error", "always-multiline"],
    "require-jsdoc": 0,
    "valid-jsdoc": 0,
    "arrow-parens": ["error", "always"],
  },
};
