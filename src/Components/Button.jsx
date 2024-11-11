import { Button as MuiButton } from "@mui/material";
import { forwardRef } from "react";

const Button = forwardRef((props, ref) => {
	return (
		<MuiButton
			variant="contained"
			sx={{
				borderRadius: 100,
				px: 2,
				typography: "link",
				color: "common.white",
			}}
			{...props}
			ref={ref}
		/>
	)
});

export default Button;
