import { List, ListItemButton, ListItemIcon, Paper } from "@mui/material";
import { NavLink } from "react-router-dom";

const NavLinksPanel = ({ links, fullWidth }) => {
	const linkStyle = {
		color: "text.primary",
		typography: "link",
		p: 2,
	};

	return (
		<Paper sx={[{ p: 1 }, !fullWidth && { width: 250 }]}>
			<List>
				{links.map((link, index) => (
					<NavLink
						key={link.label}
						to={link.addr}
						style={{ width: "100%", textDecoration: "none" }}
					>{({ isActive }) => (
						<ListItemButton
							selected={isActive}
							divider={index !== links.length - 1}
							sx={linkStyle}
						>
							{link.icon && <ListItemIcon>{link.icon}</ListItemIcon>}
							{link.label}
						</ListItemButton>
					)}</NavLink>
				))}
			</List>
		</Paper>
	);
}

export default NavLinksPanel;
