import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      semanticTokens: {
        colors: {
          bg: {
            primary: { value: { base: "#FAFAFA", _dark: "#0a0a0a" } },
            secondary: { value: { base: "#f5f5f7", _dark: "#161616" } },
            tertiary: { value: { base: "#e5e5e7", _dark: "#1f1f1f" } },
          },
          text: {
            primary: { value: { base: "#1d1d1f", _dark: "#ededed" } },
            secondary: { value: { base: "#86868b", _dark: "#a1a1a1" } },
            tertiary: { value: { base: "#cecece", _dark: "#6b6b6b" } },
          },
          border: {
            default: { value: { base: "#d1d1d6", _dark: "#333333" } },
          },
          primary: { value: { base: "#1d1d1f", _dark: "#ededed" } }, // Neutral (same as text.primary)
        },
      },
      tokens: {
        fonts: {
          body: { value: "var(--font-inter), sans-serif" },
          heading: { value: "var(--font-inter), sans-serif" },
        }
      }
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
});
