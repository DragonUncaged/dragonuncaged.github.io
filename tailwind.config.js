module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Classic VS Code Dark+ chrome with the signature blue accent
        ide: {
          canvas: "#333333", // activity bar / title bar
          sidebar: "#252526",
          editor: "#1e1e1e",
          panel: "#1e1e1e",
          tabbar: "#252526",
          border: "#3c3c3c",
          hover: "#2a2d2e",
          active: "#37373d",
          input: "#3c3c3c",
          text: "#d4d4d4",
          muted: "#9d9d9d",
          faint: "#6e6e6e",
          accent: "#3794ff",
          accentBright: "#66b2ff",
          accentDim: "#0e639c",
          statusbar: "#007acc",
        },
        // syntax palette (VS Code Dark+ defaults, mirrors Monaco's vs-dark)
        syn: {
          keyword: "#569cd6",
          string: "#ce9178",
          func: "#dcdcaa",
          num: "#b5cea8",
          comment: "#6a9955",
          type: "#4ec9b0",
          variable: "#9cdcfe",
          punct: "#d4d4d4",
        },
      },
      fontFamily: {
        mono: [
          '"JetBrains Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Ubuntu",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
  },
  plugins: [],
};
