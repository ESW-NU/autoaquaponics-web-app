import { useState, useEffect } from "react";
import { collection, query, orderBy, where, onSnapshot } from "firebase/firestore";
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

function generateMockData(numPoints, finalStats) {
	const now = Math.floor(Date.now() / 1000);
	const data = [];
	const currentData = finalStats;
	for (let i = 0; i < numPoints; i++) {
		data.push({
			unixTime: now - i * 60 * 5, // go back 5 minutes each time
			stats: {
				...currentData,
			},
		});

		// modify currentData by some random amount for each stat
		for (const statKey in currentData) {
			currentData[statKey] += currentData[statKey] * (Math.random() * 0.1 - 0.05);
		}
	}
	return data.reverse();
}

export function useTrackStats(timescale) {
	const stats = generateMockData(12, {
		TDS: 212,
		air_temp: 25,
		distance: 49.8,
		humidity: 73,
		pH: 8.1,
		water_temp: 25,
		dissolved_oxygen: 7
	});
	console.log(stats);
	return {
		loading: false,
		stats: stats,
		tolerances: {
			"TDS": { min: 100, max: 300 },
			"air_temp": { min: 20, max: 30 },
			"distance": { min: 0, max: 98 },
			"humidity": { min: 0, max: 95 },
			"pH": { min: 6, max: 8 },
			"water_temp": { min: 20, max: 30 },
			"dissolved_oxygen": { min: 5, max: 9 },
		}
	};
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
