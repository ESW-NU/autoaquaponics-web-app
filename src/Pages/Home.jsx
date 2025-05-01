/** @jsxImportSource @emotion/react */

import { Box, Stack, Typography, Link, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import AboutSection from "../Components/AboutSection";
import TypedText from '../Components/TypedText';
import "animate.css/animate.min.css";
import { AnimationOnScroll } from 'react-animation-on-scroll';


const systemCAD = require("../Lib/PlumbingCADclear.webp");
const plumbing = require("../Lib/plumbing.webp");
const filter = require("../Lib/filter.webp");
const flow = require("../Lib/flow.webp");
const sump = require("../Lib/sump.webp");
const sensor = require("../Lib/sensor.webp");
const rpi = require("../Lib/rpi.webp");
const outlet = require("../Lib/outlet.webp");
const motorized = require("../Lib/motorized.webp");
const software1 = require("../Lib/software1.webp");
const videoStream = require("../Lib/videoStream.webp");
const code = require("../Lib/code.webp");
const software2 = require("../Lib/software2.webp");
const fish = require("../Lib/fish.webp");
const topView = require("../Lib/top_view.webp");
const plants = require("../Lib/plants.webp");
const biofilm = require("../Lib/biofilm.webp");
const team = require("../Lib/team.webp");
const esw = require("../Lib/esw.webp");
const wildIdeas = require("../Lib/wild-ideas.webp");
const msab = require("../Lib/msab.webp");
const logos = require("../Lib/logos.png");

const Home = () => {
	return (
		<Stack direction="column" spacing={3}>
			<Stack direction={{ xs: "column-reverse", md: "row" }} alignItems="center">
				<img style={{ width: "50vw" }} src={systemCAD} alt="System CAD" />
				<Box sx={{ color: "text.primary" }}>
					<Typography variant="h1"><TypedText string={"Hello"} typeSpeed={40} /></Typography>
					<Typography variant="body1">
						A fully automated aquaponic system that grows both fish and plants
						unattended for months and can be <Link component={RouterLink} to="/dashboard">monitored</Link> and <Link component={RouterLink} to="/control-panel">controlled</Link> remotely
					</Typography>
				</Box>
			</Stack>
			<Stack direction="column" spacing={3}>

				<AnimationOnScroll animateIn="animate__fadeInLeftBig" duration={1} animateOnce>
					<AboutSection
						title="Mechanical Design"
						images={[plumbing, sump, flow, filter]}
						image_left={true}
					>
						Our plumbing system serves as the backbone of AutoAquaponics and facilitates the efficient
						transport of nutrients to the plants. It also removes solid waste and potentially toxic
						contaminants from the fish tank to ensure the health of our fish. AutoAquaponics’ plumbing
						consists of a 100 gallon fish tank, two 40 gallon grow beds, a 60 gallon sump tank, and a
						three-stage filtration system. The filter system includes a settling tank, a membrane
						filtration tank, and a biofilm reactor to convert ammonia from fish waste into nitrate for
						the plants.
					</AboutSection>
				</AnimationOnScroll>


				<AnimationOnScroll animateIn="animate__fadeInRightBig" duration={1} animateOnce>
					<AboutSection
						title="Software and Electronics"
						images={[sensor, rpi, outlet, code]}
						image_left={false}
					>
						<p>
							The software and electronics put the Auto in AutoAquaponics, and allow us to both monitor and control
							the system from anywhere in the world. Our electrical system features a smart
							outlet box driven by an ESP32 microcontroller that automatically toggles the lights and
							motorized ball valves in the system, allowing us to flood our two grow beds at different
							intervals and control how much light our plants get. A sensor box with a Raspberry Pi and a
							number of environmental sensors (pH, TDS, air/water temperature, relative humidity, water
							level, and dissolved oxygen) helps us understand the state of the system in real time.
							Our platform is built with React and Google Firebase, and it features a live dashboard that
							users can look at to monitor AutoAquaponics’ current state.
							The entire system is configurable from the Control Panel and Settings, enabling people with the appropriate credentials to receive
							automated email/text updates on the system and change settings to manage
							lighting/flooding durations.
						</p>
						<img src={logos} style={{ width: "100%", marginTop: "20px" }} />
					</AboutSection>
				</AnimationOnScroll>

				<AnimationOnScroll animateIn="animate__fadeInRightBig" duration={1} animateOnce>
					<AboutSection
						title="Biology"
						images={[fish, topView, biofilm, plants]}
						image_left={true}
					>
						Biology is an integral part of any farming system, and ours is no exception.
						AutoAquaponics cycles nutrients between aquatic animals, microbes, and plants, all of
						which interact in a symbiotic manner. Food starts out in the fish tank, where it is
						consumed and transformed into solid waste by the fish. This waste gets broken down by the
						heterotrophic bacteria in the filters and turns into ammonia. The ammonia in the water
						then gets captured by the nitrifying microbes, transforming it into nitrite and then
						nitrate. This final product becomes the fertilizer that our plants uptake through their
						roots to make protein and grow. We are currently cultivating wheatgrass, kale, and basil
						in our grow beds, and our fish tank is stocked with tiger barbs, mollies, South American
						cichlids, a Raphael catfish, and a red tailed shark. We also have many invertebrates
						living in the system (ramshorn snails, cherry shrimps, and gammarus pulex) to serve as
						live food sources for the fish.
					</AboutSection>
				</AnimationOnScroll>
				<AboutSection
					title="Contact Us"
					images={[team]}
					image_left={false}
				>
					Send us a message: <Link target='_blank' href='mailto:esw@u.northwestern.edu'>esw@u.northwestern.edu</Link>.
					<br />
					See our Project Blog <Link target='_blank' href='https://eswprojects.planio.com/projects/autoaquaponics'>here</Link>.
					<br />
					Download or contribute to our code on <Link target='_blank' href='https://github.com/ESW-NU/AutoAquaponics-v2.0/tree/deploy'>GitHub</Link>.
					<br /><br />
					This project was founded under <Link className='NU' target='_blank' href='https://esw-nu.github.io/'>Engineers for a Sustainable World @ Northwestern</Link>
					<br /><br />
					<i>Made possible with the support of</i>
					<Grid container direction="row" justifyContent="space-evenly">
						<img css={{ maxHeight: 60 }} src={esw} alt="Engineers for a Sustainable World" />
						<img css={{ maxHeight: 60 }} src={wildIdeas} alt="Wild Ideas" />
						<img css={{ maxHeight: 60 }} src={msab} alt="McCormick Student Advisory Board" />
					</Grid>
				</AboutSection>
			</Stack>
		</Stack>
	)
};

export default Home;
