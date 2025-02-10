import { Paper, Typography, Stack, Box, CircularProgress } from "@mui/material";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AreaGraph from "./AreaGraph";

const overflowStyle = { whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" };
const verticalCenteredStyle = { height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" };

const GraphCard = ({ name, unit, statKey, loading, stats, tolerance, timescale, zoom }) => {
	const data = stats.map(({ unixTime, stats }) => ({
		x: unixTime,
		y: stats[statKey] ?? NaN,
	}));
	const hasData = data.length > 0;
	const latestY = hasData ? data.at(-1).y : NaN;
	const inRange = !Number.isNaN(latestY) && latestY <= tolerance.max && latestY >= tolerance.min;

	const titleBar = (
		<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ height: 60, typography: "h3" }}>
			<Box sx={overflowStyle}>{name}</Box>
			{loading ? "loading"
				: !hasData ? "no data"
					: Number.isNaN(latestY) ? "it broke :("
						: <Stack direction="row" alignItems="flex-end">
							<Typography variant="h1">{latestY.toFixed(1)}</Typography>
							<Typography variant="h3">{unit}</Typography>
						</Stack>}
		</Stack>
	);
	const content = loading ? (
		<Box sx={verticalCenteredStyle}>
			<CircularProgress color="info" />
			<Typography variant="body1">Loading</Typography>
		</Box>
	) : hasData ? (
		<AreaGraph name={name} unit={unit} stats={data} isGreen={inRange} timescale={timescale} zoom={zoom} />
	) : (
		<Box sx={verticalCenteredStyle}>
			<WarningAmberIcon color="warning" sx={{ fontSize: 128 }} />
			<Typography variant="body1">There doesn't seem to be any data</Typography>
		</Box>
	);

	return (
		<Paper sx={{ p: 2 }}>
			{titleBar}
			<Box sx={{ height: 300 }}>
				{content}
			</Box>
		</Paper>
	)
};


export default GraphCard;
