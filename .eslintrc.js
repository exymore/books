module.exports = {
  extends: ['eslint:recommended', 'plugin:vue/recommended'],
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'no-undef': 'warn',
    'linebreak-style': ['error', 'unix'],
    'no-use-before-define': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'vue/no-unused-vars': 'off',
    'vue/component-tags-order': [
      'error',
      {
        order: ['template', 'script', 'style'],
      },
    ],
  },
};
