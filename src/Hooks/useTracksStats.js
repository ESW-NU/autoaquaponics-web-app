import { useState, useEffect } from "react";
import { collection, query, orderBy, where, onSnapshot, getDocs } from "firebase/firestore";
import { db } from '../firebase';
import { systemStatMeta } from "../systemMeta";

/*
Returns { loading, stats, tolerances } where stats is an array of objects representating the stats
at a certain time and tolerances is the an object where each property's
key is the key of a dashboard-tracked stat, and the value is a { min, max } object.

Data type of stats: {
	unixTime: number,
	stats: {
		[k: string]: any
	},
}[]

Data type of tolerances: {
	[k: string]: {
		min: number,
		max: number,
	},
}
*/

export function useTrackStats(timescale) {
	const [loading, setLoading] = useState(true);

	// get stats
	const [stats, setStats] = useState([]);
	useEffect(() => {
		setLoading(true);
		const lowerTimeBound = Math.floor(Date.now() / 1000) - timescale;
		const q_states = query( // the data we want to fetch
			collection(db, 'stats'),
			where('unix_time', '>', lowerTimeBound),
			orderBy('unix_time', 'asc')
		);
		const unsubscribe = onSnapshot(q_states, (snapshot) => { // real-time listener for changes to the queried stats data
			setStats(convertStatsSnapshot(snapshot)); //this is the initial data fetch
			setLoading(false);
		});
		const timer = setInterval(() => {
			const lowerTimeBoundNow = Math.floor(Date.now() / 1000) - timescale;
			// filter the stats to only include data from the last [timescale] seconds
			setStats(prevStats => prevStats.filter((stat) => stat.unixTime > lowerTimeBoundNow));
		}, 60 * 1000); // 1 min

		// make sure to unsubscribe when the component unmounts so that we don't have a bunch of listeners running
		return () => {
			unsubscribe();
			clearInterval(timer);
		}
	}, [timescale]);

	// get tolerances
	const [tolerances, setTolerances] = useState({});
	useEffect(() => {
		const q_tolerances = query(
			collection(db, 'tolerances')
		)
		const unsubscribe = onSnapshot(q_tolerances, (snapshot) => {
			setTolerances(convertTolerancesSnapshot(snapshot))
		});
		return () => {
			unsubscribe();
		}
	}, []);

	return { loading, stats, tolerances };
}

async function getStatsOnce () {
	const q_states = query( // the data we want to fetch
		collection(db, 'stats'),
		where('unix_time', '>', Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60 * 52)),
		orderBy('unix_time', 'asc')
	);
	const snapshot = await getDocs(q_states);
	console.log(snapshot)
	return convertStatsSnapshot(snapshot)
}

/*
Takes an snapshot of the 'stats' collection on Firestore and converts it to an array of objects
each representing the stats at a certain time.
*/
function convertStatsSnapshot(snapshot) {
	return snapshot.docs.map(doc => ({
		unixTime: doc.get("unix_time"),
		stats: Object.fromEntries(systemStatMeta.map(({ statKey }) => [statKey, doc.get(statKey)])),
	}));
}

/*
Takes a snapshot of the 'tolerances' collection on Firestore and converts it to an object that maps
stat keys to their tolerances.
*/
function convertTolerancesSnapshot(snapshot) {
	return Object.fromEntries(snapshot.docs.map(doc => [doc.id, doc.data()]));
}

export {getStatsOnce};
