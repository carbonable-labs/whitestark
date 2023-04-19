module.exports = {
  processors: [["@mapbox/stylelint-processor-arbitrary-tags"]],
  extends: ["stylelint-config-standard", "stylelint-config-clean-order"],
  rules: {},
  ignoreFiles: ["public/index.html"],
};
