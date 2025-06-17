"use client";
import React from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

import MuiThemeProviderForNextJs from "./MuiThemeProviderForNextJs";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";

const AppThemeProvider = ({ children }) => {
  return (
    <MuiThemeProviderForNextJs>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </MuiThemeProviderForNextJs>
  );
};

export default AppThemeProvider;
