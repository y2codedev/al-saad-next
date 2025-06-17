"use client";
import { createTheme } from "@mui/material/styles";
import { Poppins, Roboto } from "next/font/google";

// Load fonts using Next.js
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"],
});

const theme = createTheme({
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "0px",
          height: "45px",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
        .pac-container {
          z-index: 1500 !important;
        }
      `,
    },
  },
  typography: {
    fontFamily: poppins.style.fontFamily,
    fontWeightLight: 200,
    h1: { fontFamily: roboto.style.fontFamily, fontWeight: 100 },
    h2: { fontFamily: roboto.style.fontFamily, fontWeight: 100 },
    h3: { fontFamily: roboto.style.fontFamily, fontWeight: 100 },
    h4: { fontFamily: roboto.style.fontFamily, fontWeight: 100 },
    h5: { fontFamily: roboto.style.fontFamily, fontWeight: 100 },
    h6: { fontFamily: roboto.style.fontFamily, fontWeight: "500 !important" },
  },
});

export default theme;
