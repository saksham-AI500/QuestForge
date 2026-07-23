module.exports = {
  root: true,
  extends: ['expo', 'plugin:react-hooks/recommended'],
  ignorePatterns: ['/dist/*', '/node_modules/*', '/android/*', '/ios/*'],
  rules: {
    'react-hooks/exhaustive-deps': 'warn',
    'import/no-unresolved': 'off',
  },
};
