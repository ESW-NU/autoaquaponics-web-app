import { createContext } from "react";

// This context does not store the actual theme because the MUI-defined
// ThemeProvider already does the job of passing down the theme object, and
// we can just call their `useTheme` hook if we need it.
// Instead, this context deals with the string that represents which theme
// we want; i.e. 'light', 'dark', or 'system'
export const ThemeNameContext = createContext({
	themeName: 'light',
	setThemeName: _ => {},
	prefersDarkMode: false,
});
