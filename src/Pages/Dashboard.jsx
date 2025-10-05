import { Box, FormControlLabel, Stack, Switch, Typography, Button } from "@mui/material";
import { useState, useTransition } from "react";
import SelectMenu from "../Components/SelectMenu";
import GraphContainer from "../Components/GraphContainer";
import { saveAs } from 'file-saver';
import { useTrackStats, getStatsOnce } from '../Hooks/useTracksStats';

const timescaleOptions = [ // in seconds, not milliseconds
	{ value: { name: "1 hour", value: 60 * 60}, display: "1 hour" },
	{ value: { name: "1 day", value: 24 * 60 * 60}, display: "1 day" },
	{ value: { name: "1 week", value: 7 * 24 * 60 * 60}, display: "1 week" },
]

const Dashboard = () => {
	const [zoom, setZoom] = useState(false); // whether to zoom in on available portion of graph
	const [timescale, setTimescale] = useState(timescaleOptions[0].value);
	const { loading, stats, tolerances } = useTrackStats(timescale.value); // fetch the stats using the useTrackStats hook

	const downloadCSV = () => {
		if (!stats || stats.length === 0) {
			// Handle the case where stats is empty or not loaded
			console.error('No data available to download');
			return;
		}

		let csvContent = "data:text/csv;charset=utf-8,\n";
		csvContent += ["unixTime", ...Object.keys(stats[0].stats)].join(",") + "\n";
		csvContent += stats.map(row => [row.unixTime, ...Object.values(row.stats)].join(",")).join("\n");
		const blob = new Blob([csvContent], { type: 'text/csv' });
		saveAs(blob, 'exportedData.csv');
	};

	const downloadCSV1yr = async () => {
		const statsOneYear = await getStatsOnce()
		let csvContent = "data:text/csv;charset=utf-8,\n";
		csvContent += ["unixTime", ...Object.keys(statsOneYear[0].stats)].join(",") + "\n";
		csvContent += statsOneYear.map(row => [row.unixTime, ...Object.values(row.stats)].join(",")).join("\n");
		const blob = new Blob([csvContent], { type: 'text/csv' });
		saveAs(blob, 'exportedData.csv');
	};

	return (
		<Box sx={{color: "text.primary"}}>
			<Typography variant="h2">System Sensors</Typography>
			<Stack direction="row" alignItems="center" spacing={2}>
				<Box sx={{ width: 200, my: 3 }}>
					<SelectMenu
						label="timescale"
						options={timescaleOptions}
						variable={timescale}
						setVariable={newTimescale => {
							setTimescale(newTimescale);
						}}
					/>
				</Box>
				<FormControlLabel
					control={<Switch/>}
					label="Zoom in on available data"
					checked={zoom}
					onChange={() => setZoom(!zoom)}
				/>
				<Button onClick={downloadCSV} variant="contained" color="primary">
					Export as CSV ({timescale.name})
				</Button>
				<Button onClick={downloadCSV1yr} variant="contained" color="primary">
					Export as CSV (1 year)
				</Button>
			</Stack>
			<GraphContainer timescale={timescale.value} zoom={zoom} stats={stats} loading={loading} tolerances={tolerances}/>
		</Box>
	);
};

export default Dashboard;