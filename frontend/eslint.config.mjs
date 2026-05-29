import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/** @type {import("eslint").Linter.Config[]} */
const config = [
  {
    ignores: [".next/**", "node_modules/**", "out/**", "public/assets/js/**"],
  },
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      // React 19 compiler rules — too strict for existing data-fetch / swiper patterns
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
      "react-hooks/immutability": "off",
    },
  },
];

export default config;
