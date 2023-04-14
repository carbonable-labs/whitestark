module.exports = {
  processors: [
    [
      "@mapbox/stylelint-processor-arbitrary-tags",
      { fileFilterRegex: [/\.vue$/] },
    ],
  ],
  plugins: ["stylelint-scss"],
  extends: ["stylelint-config-standard", "stylelint-config-clean-order"],
  rules: {
    "color-hex-length": "long",
    "selector-class-pattern": [
      "^([a-z0-9]+(--[a-z0-9]+)?(-[a-z0-9]+)?)$",
      {
        resolveNestedSelectors: true,
        message: "Expected class selector to follow the KiZo notation",
      },
    ],
  },
  overrides: [
    {
      files: ["**/*.scss"],
      customSyntax: "postcss-scss",
    },
  ],
  ignoreFiles: ["src/vanillaJse.css", "public/index.html"],
};
