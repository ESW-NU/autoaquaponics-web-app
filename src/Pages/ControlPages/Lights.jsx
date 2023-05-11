import { useContext } from "react";
import { Stack, Typography, Grid } from "@mui/material";
import { ControlValuesContext } from "../../Hooks/ControlValuesContext";
import { systemLightsMeta } from "../../systemMeta";
import ControlCard from "../../Components/ControlCard";
import RadioControl from "../../Components/RadioControl";
import TimeControl from "../../Components/TimeControl";
import NumericalControl from "../../Components/NumericalControl";

const LightControlCard = ({ collection, partKey, name, enabled }) => {
	const document = `${collection}/${partKey}`;

	const { getValueAndStatus } = useContext(ControlValuesContext);
	const statusIsTimer = getValueAndStatus(document, "status").v === "timer";

	return (
		<ControlCard title={name}>
			<Stack spacing={1}>
				<RadioControl
					document={document}
					field="status"
					label="Status"
					enabled={enabled}
					options={[
						{ label: "On", value: "on" },
						{ label: "Off", value: "off" },
						{ label: "Timer", value: "timer" },
					]}
				/>
				<TimeControl
					label="Start time"
					document={document}
					enabled={enabled && statusIsTimer}
				/>
				<Stack direction="row" spacing={1}>
					<NumericalControl
						label="Duration (H)"
						document={document}
						field="durationhh"
						verify={n => n >= 0}
						enabled={enabled && statusIsTimer}
					/>
					<NumericalControl
						label="Duration (M)"
						document={document}
						field="durationmm"
						verify={n => n >= 0}
						enabled={enabled && statusIsTimer}
					/>
				</Stack>
			</Stack>
		</ControlCard>
	);
}

const collection = "lights";

export const Lights = ({ enabled }) => {
	return (
		<Stack spacing={1}>
			<Typography variant="h2">Lights</Typography>
			<Grid container spacing={1} columns={{ xs: 1, sm: 2 }}>
				{systemLightsMeta.map(({ partKey, name }) => (
					<Grid item key={partKey} xs={1}>
						<LightControlCard collection={collection} partKey={partKey} name={name} enabled={enabled}/>
					</Grid>
				))}
			</Grid>
		</Stack>

	);
};

export default Lights;
