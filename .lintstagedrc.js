module.exports = {
  "*.{js,ts,jsx,tsx}": "eslint --cache --fix",
  "*.{css,scss,sass,html}": "stylelint --fix",
  "*.**": "prettier --write --ignore-unknown",
};
