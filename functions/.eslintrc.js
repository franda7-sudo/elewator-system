module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    "ecmaVersion": 2018,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": ["error", "double", { "allowTemplateLiterals": true }],

    // --- DODANE REGUŁY NAPRAWCZE ---
    "linebreak-style": 0, // Ignoruje błędy CRLF (Windows) / LF (Linux)
    "object-curly-spacing": ["error", "always"], // Wymusza spacje wewnątrz { }
    "indent": ["error", 2], // Wymusza wcięcie 2 spacji (zgodnie z Google)
    "max-len": "off", // Wyłącza limit długości linii (częsty błąd przy mapach)
    "comma-dangle": ["error", "always-multiline"], // Wymaga przecinków tylko w wielu liniach
    "require-jsdoc": 0, // Wyłącza wymóg pisania dokumentacji JSDoc dla każdej funkcji
    "valid-jsdoc": 0, // Wyłącza walidację JSDoc
    "arrow-parens": ["error", "always"], // Wymusza nawiasy w arrow functions (np. (cellId) => ...)
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
