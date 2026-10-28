// Same theme Canva used; compiled once instead of loading Tailwind from a CDN on every visit.
module.exports = {
  content: ["../index.html", "../impressum/index.html", "../datenschutz/index.html"],
  theme: {
    extend: {
      colors: {
        cream: "#FAF4EC", cardBg: "#FFFDF9", textDark: "#2B2420", terracotta: "#B4502B", terracottaHover: "#983E1E",
        tealSec: "#2F7F70", tealHover: "#236357", nightBlue: "#1A202B", softGold: "#C9953A", peachLight: "#FBE8D8", warmAmber: "#D99B26",
      },
      fontFamily: { serif: ['"Cormorant Garamond"', "Georgia", "serif"], sans: ["Inter", "sans-serif"] },
      boxShadow: {
        warm: "0 10px 30px -5px rgba(180, 80, 43, 0.08), 0 4px 12px -2px rgba(43, 36, 32, 0.04)",
        "warm-hover": "0 20px 40px -5px rgba(180, 80, 43, 0.15), 0 8px 20px -2px rgba(43, 36, 32, 0.08)",
        orb: "0 0 50px 15px rgba(180, 80, 43, 0.3)",
        oxford: "0 15px 40px -5px rgba(26, 32, 43, 0.25)",
      },
    },
  },
};
