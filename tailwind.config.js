/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,mdx}", "./components/**/*.{js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Brand palette — reference these tokens everywhere instead of
        // hardcoding hex values so the theme stays consistent site-wide.
        ink: "#0A0A0A", // near-black — header/footer/dark sections, primary text on light bg
        paper: "#F5F5F0", // off-white — main content backgrounds, text on dark sections
        gold: "#C9A24B", // accent only — CTAs, buttons, prices, active states, highlights
        gray: "#8C8C8C", // neutral — secondary text, dividers, muted UI
        espresso: "#3D2E0A", // dark text on gold buttons (accessible contrast)
      },
      fontFamily: {
        // Cormorant Garamond — headings, display text, brand name.
        display: ["var(--font-display)", "Georgia", "serif"],
        // Jost — body text and everything else; also the site-wide default.
        sans: ["var(--font-sans)", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
