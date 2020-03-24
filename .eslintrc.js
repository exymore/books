module.exports = {
  extends: ["eslint:recommended", "plugin:vue/recommended"],
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  plugins: ['vue'],
  rules: {
    "no-undef": "warn",
    "linebreak-style": ["error", "unix"],
    "no-use-before-define": "off",
    "no-unused-vars": "off",
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "comma-dangle": ["error", "always-multiline"],
    "vue/component-tags-order": [
      "error",
      {
        order: ["template", "script", "style"],
      },
    ],
  },
};
