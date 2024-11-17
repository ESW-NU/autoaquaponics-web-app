import { useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
import { Container, ThemeProvider, useMediaQuery } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { UserContext } from './Hooks/UserContext';
import { ThemeNameContext } from "./Hooks/ThemeNameContext";
import { ToastContainer } from 'react-toastify';
import { getTheme } from './styling';
import NavBar from './Components/NavBar';
import Home from './Pages/Home';
import Dashboard from './Pages/Dashboard';
import ControlPanel from "./Pages/ControlPanel";
import Settings from "./Pages/Settings";
import Login from './Pages/Login';
import ResetPassword from './Pages/ResetPassword';
import ComingSoon from './Components/ComingSoon';
import { VideoFeed } from './Pages/VideoFeed';

const TRACKING_ID = "G-XQDHE464FW";
ReactGA.initialize(TRACKING_ID);

const App = () => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

	const [user, setUser] = useState(null);
	const [themeName, setThemeName] = useState('light');


	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
		})
		return () => {
			unsubscribe();
		}
	}, []);

	useEffect(() => {
		if (document.location.hostname.search("localhost") === -1) {
			ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search + window.location.host});
		}
	}, []);

	const setThemeNameShim = (newThemeName) => {
		setThemeName(newThemeName);
	  };

	  const { muiTheme, bgcolor } = getTheme(themeName, prefersDarkMode);

	  useEffect(() => {
		const body = document.getElementsByTagName('body')[0];
		body.style.backgroundColor = bgcolor;
	  }, [themeName]);


	return (
		<BrowserRouter>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<UserContext.Provider value={user}>
					<ThemeProvider theme={muiTheme}>
						<ThemeNameContext.Provider value={{ themeName: themeName, setThemeName: setThemeName, prefersDarkMode: prefersDarkMode }}>
							<ToastContainer/>
							<NavBar/>
							<Container maxWidth="xl">
								<Routes>
									<Route path="/" element={<Home/>}/>
									<Route path="/video-stream" element={<VideoFeed/>}/>
									<Route path="/dashboard" element={<Dashboard/>}/>
									<Route path="/control-panel/*" element={<ControlPanel/>}/>
									<Route path="/settings" element={<Settings/>}/>
									<Route path="/login" element={<Login/>}/>
									<Route path="/reset-password" element={<ResetPassword/>}/>
								</Routes>
							</Container>
						</ThemeNameContext.Provider>
					</ThemeProvider>
				</UserContext.Provider>
			</LocalizationProvider>
		</BrowserRouter>
	);
}

export default App;
