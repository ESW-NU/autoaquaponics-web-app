/** @jsxImportSource @emotion/react */

import { NavLink } from "react-router-dom";
import { Box } from "@mui/system";

const BubbleNavLinks = ({ links }) => {
	const linkStyle = {
		color: "text.primary",
		typography: "link",
		px: 0,
		py: 1,
		textDecoration: "none",
		borderRadius: 50,
	};
	const hoverLinkStyle = {
		filter: "drop-shadow(10px 6px 30px rgba(0, 0, 0, 1))",
	};
	const activeLinkStyle = {
		px: 4,
		py: 1,
		bgcolor: "primary.contrastText",
		filter: "drop-shadow(1px 1px 20px rgba(0, 0, 0, 0.2))",
	};

	return (
		<>
			{links.map((link) =>
				<NavLink key={link.label} css={{ textDecoration: "inherit" }} to={link.addr}>{({ isActive }) =>
					<Box sx={[
						linkStyle,
						isActive ? activeLinkStyle : { "&:hover": hoverLinkStyle },
					]}>
						{link.label}
					</Box>
				}</NavLink>
			)}
		</>
	);
};

export default BubbleNavLinks;