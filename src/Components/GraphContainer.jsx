import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from '../firebase';
import GraphCard from "./GraphCard";
import { Grid, Alert, Typography } from "@mui/material";
import { systemStatMeta } from "../systemMeta";
import { Fade } from 'react-awesome-reveal';

const GraphContainer = ({ timescale, zoom, stats, loading, tolerances }) => {

	// idiocy ensues
	const [doxxedPpl, setDoxxedPpl] = useState([]);
	const doxx = async () => {
		getDocs(query(collection(db, 'harassment-targets')))
			.then(snapshot => {
				setDoxxedPpl(snapshot.docs.map(doc => ({ name: doc.get("name"), phoneNum: doc.get("phone") })));
			});
	};
	useEffect(() => {
		doxx();
	}, []);
	const existsBadReading = !loading && (stats.length == 0 || Object.values(stats.at(-1).stats).includes(NaN));
	//

	let lastRetrieved;
	const lastTime = stats.at(-1)?.unixTime;
	if (typeof lastTime === 'undefined') {
		lastRetrieved = "Data not retrieved."
	} else {
		lastRetrieved = "Last Retrieved: " + new Date(lastTime * 1000).toLocaleString();
	}

	return (
		<>
			<Typography sx={{ my: 1 }} variant="body1">
				{lastRetrieved}
			</Typography>

			{existsBadReading && <Alert sx={{ my: 3 }} severity="error">
				You may have noticed some sensors aren't working properly. This is 100% the fault of
				the electronics team.
			</Alert>}
			<Grid
				container
				spacing={1}
				columns={{ xs: 1, md: 2, lg: 3 }}
			>
				{systemStatMeta.map(({ statKey, name, unit }, index) => (
					<Grid item xs={1} key={statKey}>
						<Fade cascade={true} duration={1000} delay={index * 200} triggerOnce>
							<GraphCard
								name={name}
								unit={unit}
								statKey={statKey}
								loading={loading}
								stats={stats}
								tolerance={tolerances.hasOwnProperty(statKey) ? tolerances[statKey] : { min: 0, max: 0 }} // in case tolerances haven't loaded in yet
								timescale={timescale}
								zoom={zoom}
							/>
						</Fade>
					</Grid>
				))}
			</Grid>
		</>
	);
};

export default GraphContainer;
