//* Patches eslint's module resolution
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
	extends: "@recodive/eslint-config",
	rules: {
		"@typescript-eslint/no-explicit-any": "off",
	},
};
