/*
Each element in this array represents a statistic that the dashboard will track and that the
tolerances control page will control; updating this object will cause both pages to change too
*/
export const systemStatMeta = [
	{ statKey: "pH", name: "pH", unit: "" },
	{ statKey: "flow", name: "Flow Rate", unit: "gal/min" },
	{ statKey: "TDS", name: "Total Dissolved Solids", unit: "ppm" },
	{ statKey: "air_temp", name: "Air Temperature", unit: "ºC" },
	{ statKey: "distance", name: "Water Level", unit: "cm" },
	{ statKey: "humidity", name: "Humidity", unit: "%" },
	{ statKey: "water_temp", name: "Water Temperature", unit: "ºC" },
	{ statKey: "dissolved_oxygen", name: "Dissolved Oxygen", unit: "mg/L" },
	{ statKey: "flow", name: "Flow Rate", unit: "gal/min"}
];

/*
Each element in this array represents a component of the system whose lights can be controlled.
*/
export const systemLightsMeta = [
	{ partKey: "shelf1", name: "Shelf 1" },
	{ partKey: "shelf2", name: "Shelf 2" },
	{ partKey: "fish-tank", name: "Fish Tank" },
	{ partKey: "basking", name: "Basking" },
];

/* Each element in this array represents a collection whose documents are hold the control values
for the system */
export const systemControlsCollections = [
	"tolerances",
	// add "backwashing" here when it's ready
	"lights",
	"water-pump",
	// add fish feeder here when it's ready
];
