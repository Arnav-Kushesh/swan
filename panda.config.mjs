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
            primary: { value: "var(--colors-bg-primary)" },
            secondary: { value: "var(--colors-bg-secondary)" },
            tertiary: { value: "var(--colors-bg-tertiary)" },
            subtle: { value: "var(--colors-bg-secondary)" },
            muted: { value: "var(--colors-bg-tertiary)" },
            canvas: { value: "var(--colors-bg-tertiary)" },
          },
          text: {
            primary: { value: "var(--colors-text-primary)" },
            secondary: { value: "var(--colors-text-secondary)" },
            tertiary: { value: "var(--colors-text-tertiary)" },
            muted: { value: "var(--colors-text-secondary)" },
          },
          border: {
            DEFAULT: { value: "var(--colors-border-default)" },
            default: { value: "var(--colors-border-default)" },
            subtle: { value: "var(--colors-border-default)" },
            active: { value: "var(--colors-primary)" },
            primary: { value: "var(--colors-border-default)" },
          },
          primary: { value: "var(--colors-primary)" },
        },
      },
      tokens: {
        fonts: {
          body: { value: "var(--font-primary), sans-serif" },
          heading: { value: "var(--font-secondary), sans-serif" },
        },
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        fadeInUp: {
          from: { opacity: 0, transform: "translateY(20px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        scaleUp: {
          from: { opacity: 0, transform: "scale(0.95)" },
          to: { opacity: 1, transform: "scale(1)" },
        },
        slideDown: {
          from: { opacity: 0, transform: "translateY(-10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
});
