import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
	{
		node: true,
		files: ["**/*.js"],
		plugins: {
			js,
		},
		extends: ["js/recommended"],
		rules: {
			"no-unused-vars": "warn",
			"no-undef": "warn",
		},
	},
]);
