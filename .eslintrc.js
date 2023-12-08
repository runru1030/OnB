module.exports = {
  env: {
    es2021: true,
    browser: true,
    node: true,
    worker: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@next/next/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "next",
  ],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "unused-imports"],
  rules: {
    "jsx-a11y/anchor-is-valid": "off",
    "no-console": ["error", { allow: ["warn", "error"] }],
    "react/prop-types": "off",
    "jsx-a11y/no-autofocus": "off",
    "no-unused-vars": off,
  },
};
