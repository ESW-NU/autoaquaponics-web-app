import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { light } from "@mui/material/styles/createPalette";

const commonThemeOptions = {
	typography: {
		h1: {
			fontFamily: "Space Grotesk",
			textTransform: "none",
			fontSize: 56,
			fontWeight: 600,
		},
		h2: {
			fontFamily: "Space Grotesk",
			textTransform: "none",
			fontSize: 32,
		},
		h3: {
			fontFamily: "Space Grotesk",
			textTransform: "none",
			fontSize: 24,
		},
		h4: {
			fontFamily: "Inter",
			textTransform: "none",
			fontSize: 24,
			lineHeight: 1.5,
		},
		body1: {
			fontFamily: "Inter",
			textTransform: "none",
			fontSize: 18,
			lineHeight: 1.43,
		},
		body2: {
			fontFamily: "Inter",
			textTransform: "none",
			fontSize: 14,
		},
		title: {
			fontFamily: "Space Grotesk, sans-serif",
			textTransform: "none",
			fontWeight: 700,
			fontSize: 24,
		},
		link: {
			fontFamily: "Inter, sans-serif",
			textTransform: "none",
			fontSize: 18,
			textDecoration: "none",
		},
		button: {
			fontFamily: "Inter",
		},
	},
};

const lightThemeOptions = {
	...commonThemeOptions,
	palette: {
		primary: {
			light: "#4cc174",
			main: "#009444",
			dark: "#006326",
		},
		edited: {
			dark: "#b28704",
			main: "#ffc107",
			light: "#ffcd38",
		},
	},
};

const darkThemeOptions = {
	...commonThemeOptions,
	palette: {
		mode: 'dark',
		primary: {
			light: "#e3f2fd",
			main: "#90caf9",
			dark: "#42a5f5",
		},
		edited: {
			dark: "#b28704",
			main: "#ffc107",
			light: "#ffcd38",
		},
	},
};

const lightThemeMui = responsiveFontSizes(createTheme(lightThemeOptions));
const lightTheme = {
	muiTheme: lightThemeMui,
	bgcolor: "#F2F2F2",
};
const darkThemeMui = responsiveFontSizes(createTheme(darkThemeOptions));
const darkTheme = {
	muiTheme: darkThemeMui,
	bgcolor: "#444444",
};

const getTheme = (themeName, prefersDarkMode) => {
	switch (themeName) {
		case 'light': return lightTheme;
		case 'dark': return darkTheme;
		case 'system': return prefersDarkMode ? darkTheme : lightTheme;
		default: return lightTheme;
	}
}

export { getTheme };
