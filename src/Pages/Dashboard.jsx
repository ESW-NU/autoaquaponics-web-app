import { Box, FormControlLabel, Stack, Switch, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Chip } from "@mui/material";
import { useState, useEffect } from "react";
import SelectMenu from "../Components/SelectMenu";
import GraphContainer from "../Components/GraphContainer";
import { saveAs } from 'file-saver';
import { useTrackStats, getStatsOnce } from '../Hooks/useTracksStats';
import Papa from 'papaparse';

const timescaleOptions = [
	{ value:    { name:   "1 hour", value: 60 * 60}, display:    "1 hour" },
	{ value:  { name: "1 day", value: 24 * 60 * 60}, display:  "1 day" },
	{ value: { name:    "1 week", value:   7 * 24 * 60 * 60}, display:  "1 week" },
]

const headerCellStyle = {
	backgroundColor:  '#2e7d32',
	color:    'white',
	fontWeight:   'bold',
};

const Dashboard = () => {
	const [zoom, setZoom] = useState(false);
	const [timescale, setTimescale] = useState(timescaleOptions[0].   value);
	const { loading, stats, tolerances } = useTrackStats(timescale.   value);

	const [observations, setObservations] = useState([]);
	const [observationsLoading, setObservationsLoading] = useState(true);
	const [observationsError, setObservationsError] = useState(null);

	useEffect(() => {
		const fetchObservations = async () => {
			try {
				const sheetUrl = `https://docs.google.com/spreadsheets/d/1D5Tgh4gNu8G6dhOafY3qULOyhmZFJ1komspQ_unnQJ4/export?format=csv&gid=0`;
				const response = await fetch(sheetUrl);
				
				if (!response.ok) {
					throw new Error(`Failed to fetch sheet: ${response.status}`);
				}
				
				const csvText = await response.text();
				
				// this is where sheet data starts to be displayed
				// first row is for headers in the sheet
				const lines = csvText.split('\n');
				const csvWithoutFirstRow = lines.slice(1).join('\n');
				
				Papa.parse(csvWithoutFirstRow, {
					header: true,
					skipEmptyLines: true,
					complete:  (results) => {
						const parsedObservations = results.  data
							.map((row) => {
								const dateStr = row['date'];
								const pHValue = parseFloat(row['pH (ONE NUMBER)']);
								const waterTemp = parseFloat(row['water temperature (C)']);
								const nitrate = row['nitrate levels'] || '';
								const ammonia = row['ammonia levels'] || '';
								const waterHeight = row['water height from top of fish tank (in)'] || '';
								const dissolvedOxygen = row['dissolved oxygen levels'] || '';
								const waterChange = row['water change (Amount by number of buckets)'] || '';
								const waterTreatment = row['water treatment?  '] || '';
								const observation = row['observations'] || '';

								if (!  dateStr) return null;

								let date;
								const parts = dateStr.split('/');
								if (parts.length >= 2) {
									const month = parseInt(parts[0]) - 1;
									const day = parseInt(parts[1]);
									let year;
									
									if (parts[2]) {
										year = parseInt(parts[2]);
										// will need to be changed soon...
										if (year < 100) {
											year = 2000 + year;
										}
									} else {
										// the data values in the google sheet can be different formats
										// to fix this, we assume that if the year in 2026 would be in the future, we go back one year
										// this is a temporary fix
										const currentDate = new Date();
										const currentYear = currentDate.getFullYear();
										const testDate = new Date(currentYear, month, day);
										
										if (testDate > currentDate) {
											year = currentYear - 1;
										} else {
											year = currentYear;
										}
									}
									
									date = new Date(year, month, day);
								}

								if (!  date || isNaN(date.getTime())) return null;

								return {
									date,
									pH:    isNaN(pHValue) ? null : pHValue,
									waterTemp:    isNaN(waterTemp) ? null : waterTemp,
									nitrate,
									ammonia,
									waterHeight,
									dissolvedOxygen,
									waterChange,
									waterTreatment,
									observations: observation,
								};
							})
							.filter(d => d !== null)
							.sort((a, b) => b.date - a.date);
						
						setObservations(parsedObservations);
						setObservationsLoading(false);
					},
					error:   (err) => {
						setObservationsError('Failed to parse Google Sheets data:   ' + err.message);
						setObservationsLoading(false);
					}
				});
			} catch (err) {
				setObservationsError('Failed to fetch observations:  ' + err.message);
				setObservationsLoading(false);
			}
		};

		fetchObservations();
	}, []);

	const downloadCSV = () => {
		if (!  stats || stats.length === 0) {
			console.error('No data available to download');
			return;
		}

		let csvContent = "data:  text/csv;charset=utf-8,\n";
		csvContent += ["unixTime", ...   Object.keys(stats[0].   stats)].join(",") + "\n";
		csvContent += stats.map(row => [row.  unixTime, ...  Object.values(row.  stats)].join(",")).join("\n");
		const blob = new Blob([csvContent], { type: 'text/csv' });
		saveAs(blob, 'exportedData.  csv');
	};

	const downloadCSV1yr = async () => {
		const statsOneYear = await getStatsOnce()
		let csvContent = "data:  text/csv;charset=utf-8,\n";
		csvContent += ["unixTime", ...  Object.keys(statsOneYear[0].  stats)].join(",") + "\n";
		csvContent += statsOneYear.map(row => [row.  unixTime, ... Object.values(row.  stats)].join(",")).join("\n");
		const blob = new Blob([csvContent], { type:    'text/csv' });
		saveAs(blob, 'exportedData.  csv');
	};

	return (
		<Box sx={{color:  "text.  primary"}}>
			<Typography variant="h2">System Sensors</Typography>
			<Stack direction="row" alignItems="center" spacing={2}>
				<Box sx={{ width: 200, my:    3 }}>
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
					Export as CSV ({timescale.  name})
				</Button>
				<Button onClick={downloadCSV1yr} variant="contained" color="primary">
					Export as CSV (1 year)
				</Button>
			</Stack>
			<GraphContainer timescale={timescale. value} zoom={zoom} stats={stats} loading={loading} tolerances={tolerances}/>
			
			{/* observations table */}
			<Box sx={{ mt: 5 }}>
				<Typography variant="h2" gutterBottom>Manual Observations</Typography>
				<Typography variant="body1" sx={{ mb: 2 }}>
					Observations recorded by team members from the monitoring spreadsheet.  
				</Typography>
				
				{observationsLoading ? (
					<Box sx={{ display:    'flex', justifyContent:    'center', p:  4 }}>
						<CircularProgress />
						<Typography sx={{ ml: 2 }}>Loading observations...</Typography>
					</Box>
				) : observationsError ? (
					<Paper sx={{ p: 2, bgcolor: 'error.light' }}>
						<Typography color="error">{observationsError}</Typography>
					</Paper>
				) : observations.length === 0 ? (
					<Paper sx={{ p:    2 }}>
						<Typography>No observations found.  </Typography>
					</Paper>
				) : (
					<TableContainer component={Paper} sx={{ maxHeight:    500 }}>
						<Table stickyHeader sx={{ minWidth: 650 }} size="small">
							<TableHead>
								<TableRow>
									<TableCell sx={headerCellStyle}>Date</TableCell>
									<TableCell sx={headerCellStyle} align="right">pH</TableCell>
									<TableCell sx={headerCellStyle} align="right">Water Temp (C)</TableCell>
									<TableCell sx={headerCellStyle} align="right">Nitrate</TableCell>
									<TableCell sx={headerCellStyle} align="right">Ammonia</TableCell>
									<TableCell sx={headerCellStyle} align="right">Water Height (in)</TableCell>
									<TableCell sx={headerCellStyle} align="right">Dissolved O2</TableCell>
									<TableCell sx={headerCellStyle} align="right">Water Change</TableCell>
									<TableCell sx={headerCellStyle}>Treatment</TableCell>
									<TableCell sx={headerCellStyle}>Notes</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{observations.map((row, idx) => (
									<TableRow 
										key={idx} 
										sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}
									>
										<TableCell>{row.date.toLocaleDateString()}</TableCell>
										<TableCell align="right">
											{row.pH !== null ?    (
												<Chip 
													label={row.pH.  toFixed(1)} 
													size="small"
													color={row.pH >= 6.5 && row.pH <= 7.5 ? "success" : "warning"}
												/>
											) : '-'}
										</TableCell>
										<TableCell align="right">{row.waterTemp !== null ?   row.waterTemp.toFixed(1) : '-'}</TableCell>
										<TableCell align="right">{row.nitrate || '-'}</TableCell>
										<TableCell align="right">{row.ammonia || '-'}</TableCell>
										<TableCell align="right">{row.waterHeight || '-'}</TableCell>
										<TableCell align="right">{row.dissolvedOxygen || '-'}</TableCell>
										<TableCell align="right">{row.waterChange || '-'}</TableCell>
										<TableCell>{row.waterTreatment || '-'}</TableCell>
										<TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
											{row.observations || '-'}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				)}
				
				<Typography variant="body2" sx={{ mt: 2, color:  'text.secondary' }}>
					Showing {observations.length} observations | 
					<a 
						href="https://docs.google.com/spreadsheets/d/1D5Tgh4gNu8G6dhOafY3qULOyhmZFJ1komspQ_unnQJ4/edit" 
						target="_blank" 
						rel="noopener noreferrer"
						style={{ marginLeft: 8 }}
					>
						View/Edit Spreadsheet
					</a>
				</Typography>
			</Box>
		</Box>
	);
};

export default Dashboard;