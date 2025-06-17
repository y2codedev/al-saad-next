import { FunctionComponent, PropsWithChildren } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
/**
 * Platform-specific ThemeProvider for Next.js
 * @component MuiThemeProviderForNextJs
 */
const MuiThemeProviderForNextJs = ({ children }) => {
  return <AppRouterCacheProvider>{children}</AppRouterCacheProvider>;
};

export default MuiThemeProviderForNextJs;
