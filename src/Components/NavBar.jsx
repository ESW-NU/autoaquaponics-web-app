/** @jsxImportSource @emotion/react */

import { useState, useContext } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import AccountBubble from "../Components/AccountBubble";
import { Grid, Stack, Box, useMediaQuery, Typography, IconButton, Collapse, Tooltip, Paper, List, ListItemButton, ListItemIcon, ListItemText, Divider, useTheme } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import MyButton from "../Components/Button";
import BubbleNavLinks from './BubbleNavLinks';
import { UserContext } from "../Hooks/UserContext";
import VideocamIcon from '@mui/icons-material/Videocam';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BuildIcon from '@mui/icons-material/Build';
import NavLinksPanel from './NavLinksPanel';

const links = [
	{ addr: "/video-stream", label: "Video Stream" },
	{ addr: "/dashboard", label: "Dashboard" },
	{ addr: "/control-panel", label: "Control Panel" },
];

export const NavBar = () => {
	const theme = useTheme();
	const isSmall = useMediaQuery(theme.breakpoints.down("md"));
	const [open, setOpen] = useState(false);
	const user = useContext(UserContext);
	const navigate = useNavigate();

	return (
		<>
			<Stack direction="row" alignItems="center" spacing={3} sx={{ p: 2, height: 60 }}>
				{isSmall && <IconButton onClick={() => setOpen(!open)}>
					{open ? <MenuOpenRoundedIcon /> : <MenuRoundedIcon />}
				</IconButton>}
				<Grid container direction="row" justifyContent="space-between" alignItems="center">
					<Grid item>
						<NavLink css={{ textDecoration: "inherit" }} to="/">
							<Typography sx={{ color: "primary.main", "&:hover": { color: "primary.dark" } }} variant="title">AutoAquaponics</Typography>
						</NavLink>
					</Grid>
					{!isSmall && <Grid item xs>
						<Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-evenly" alignItems="center">
							<BubbleNavLinks links={links} />
						</Stack>
					</Grid>}
					<Grid item>
						{user === null ? (
							<MyButton onClick={() => navigate("/login")}>Login</MyButton>
						) : (
							<AccountBubble/>
						)}
					</Grid>
				</Grid>
			</Stack>
			<Collapse in={open && isSmall} timeout="auto" unmountOnExit>
				<Box sx={{ p: 3 }}>
					<NavLinksPanel fullWidth links={[
						{ label: "Video Stream", addr: "/video-stream", icon: <VideocamIcon/> },
						{ label: "Dashboard", addr: "/dashboard", icon: <DashboardIcon/> },
						{ label: "Control Panel", addr: "/control-panel", icon: <BuildIcon/> },
					]}/>
					<Divider sx={{ my: 2 }}/>
				</Box>
			</Collapse>
		</>
	);
};

export default NavBar;
