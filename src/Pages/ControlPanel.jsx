import React, { useContext, useEffect, useReducer, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import HeightIcon from '@mui/icons-material/Height';
import WavesIcon from '@mui/icons-material/Waves';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFan } from '@fortawesome/free-solid-svg-icons'
import { ctrlValsReducer, ControlValuesContext } from "../Hooks/ControlValuesContext";
import { collection, getDocs,query, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';
import { systemControlsCollections } from "../systemMeta";
import NavLinksPanel from "../Components/NavLinksPanel";
import Tolerances from "./ControlPages/Tolerances";
import Backwashing from "./ControlPages/Backwashing";
import FishFeeder from "./ControlPages/FishFeeder";
import Lights from "./ControlPages/Lights";
import WaterPump from "./ControlPages/WaterPump";
import ControlsOverviewPanel from "../Components/ControlsOverviewPanel";
import { UserContext } from "../Hooks/UserContext";


const ControlPanel = () => {
	const theme = useTheme();
	const isSmall = useMediaQuery(theme.breakpoints.down("md"));
	const [loading, setLoading] = useState(true); // tracks the initial loading
	const [syncing, setSyncing] = useState(false); // tracks when data is sent to the backend
	const [ctrlVals, dispatchCtrlVals] = useReducer(ctrlValsReducer, { remote: {}, local: {} });

	// Returns a pair with:
	// - an unsubscribe function that unsubscribes the listener
	// - a Promise that resolves with nothing when the first snapshot has been retrieved
	const trackCollectionValues = (collName) => {
		let unsubscribe;
		const promise = new Promise((resolve) => {
			// this is the listener for the realtime updates
			unsubscribe = onSnapshot(
				collection(db, collName),
				{ includeMetadataChanges: true },
				(querySnapshot) => {
					const pairs = querySnapshot.docs.map(doc => [doc.ref.path, doc.data()]);
					if (!querySnapshot.metadata.hasPendingWrites) {
						// received real-deal update from the backend
						dispatchCtrlVals({ type: "update_remote", newRemote: Object.fromEntries(pairs) });
						setSyncing(false)
					} else {
						// receieved "fake" update from local change
						setSyncing(true)
					}
					resolve();
				}
			);
		})
		return [unsubscribe, promise];
	};

	useEffect(() => {
		const [unsubscribes, promises] = unzip(systemControlsCollections.map((collName) => {
			return trackCollectionValues(collName);
		}));
		Promise.all(promises).then(() => setLoading(false));
		return () => unsubscribes.forEach(unsubscribe => unsubscribe());
	}, []);

	const user = useContext(UserContext);
	const enabled = user !== null;

	return (
		<ControlValuesContext.Provider value={{
			ctrlVals,
			dispatchCtrlVals,
		}}>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<ControlsOverviewPanel loading={loading} syncing={syncing}/>
				</Grid>
				<Grid item xs={12} md="auto" >
					<NavLinksPanel fullWidth={isSmall} links={[ 
						{ label: "Tolerances", addr: "tolerances", icon: <HeightIcon/> },
						{ label: "Backwashing", addr: "backwashing", icon: <WavesIcon/>},
						{ label: "Fish Feeder", addr: "fishFeeder", icon: <FastfoodIcon/> },
						{ label: "Lights", addr: "lights", icon: <LightbulbIcon/> },
						{ label: "Water Pump", addr: "waterPump", icon: <FontAwesomeIcon icon={faFan}/> },
					]}/>
				</Grid>
				<Grid item xs sx={{color: "text.primary"}}>
					<Routes>
						<Route index element={<Navigate replace to="tolerances"/>}/>
						<Route path="tolerances" element={<Tolerances enabled={enabled}/>}/>
						<Route path="backwashing" element={<Backwashing enabled={enabled}/>}/>
						<Route path="fishFeeder" element={<FishFeeder enabled={enabled}/>}/>
						<Route path="lights" element={<Lights enabled={enabled}/>}/>
						<Route path="waterPump" element={<WaterPump enabled={enabled}/>}/>
					</Routes>
				</Grid>
			</Grid>
		</ControlValuesContext.Provider>
	);
};

// "Unzips" an array of pairs into a pair of arrays
function unzip(arrayOfPairs) {
	const aList = []
	const bList = []
	arrayOfPairs.forEach(([a, b]) => {
		aList.push(a);
		bList.push(b);
	});
	return [aList, bList];
}

export default ControlPanel;
