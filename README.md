# AutoAquaponics v2.0

AutoAquaponics v2.0 is a web-based application for monitoring and controlling the physical AutoAquaponics system, created and maintained by Engineers for a Sustainable World (ESW) at Northwestern University. You can read more about AutoAquaponics [here](https://esw-nu.github.io/pages/auto-aquaponics.html). The application is intended to allow members of ESWNU to remotely manage the system, as well as for members of the general public to view and learn more about it.

The currently deployed iteration of the website (reflected by the latest release) is hosted at https://autoaquaponics.org/.

## Technologies

The frontend uses the React framework, with [Material UI](https://mui.com/) providing the main interface components and [Recharts](https://recharts.org/en-US) providing graphing capabilities. [Firebase](https://firebase.google.com/) is used as the backend for user authentication, app authentication (with App Check), database (with Firestore), and hosting. The database is the primary method of communication between the web app and the physical system. For example, the system writes the data it collects to the database which is then displayed by the web app's dashboard; the web app's control panel writes its changes to the database which are picked up by the system.

## Building and running

### Setup

To build and run this app, you must have the `npm` installed. To deploy the app, you must have the `firebase` command installed and also be logged into an account with access to the Firebase project. To run with emulators, you must have the appropriate emulators downloaded (look up `firebase init emulators`). Run `npm install` in the project directory once to install all required packages. (You may need to run `npm install --force` instead, if there are dependency conflicts.) You may also need to rerun the `npm start` script after installing. Switching between branches that have different dependencies may require running `npm install` again.

### Development

Running `npm start` in the project directory will run the app in development mode on `http://localhost:3000`. *This mode uses the production database.* Running `npm run start-emulated` in the project directory will run the app in development mode using Firestore emulators. The application will reload in the browser with hotfixes when changes are made to the source files. Use Ctrl + C to stop the script. Although the hotfixing works great most of the time, you may need to reload the browser page or even stop and restart the script for some changes to take place.

Note that, unless you have one of our super secret debug tokens, all Firebase App Checks will fail because of the local development environment. Normally, this would mean that the application will not be able to interact with the Firestore backend database; however, App Check is currently not enforced. Use a debug token or a [local emulator](https://firebase.google.com/docs/emulator-suite) to solve this issue.

### Production

Running `npm run build` in the project directory will create an optimized production build in the `build` folder. This build can be served locally by running `serve -s build` and connecting to `http://localhost:3000`, or by running `firebase emulators:start` and connecting to `http://localhost:5000`. With the appropriate permissions, the build can be deployed to a preview Firebase hosting channel using `firebase hosting:channel:deploy CHANNEL-ID`, replacing `CHANNEL-ID` with the name of the preview channel. Avoid deploying to the live channel using this method; prefer making a pull request to the `deploy` branch instead.

## Oveview of features

### Home page

The home page contains an overview of the AutoAquaponics system and the subteams responsible for maintaining it, as well as contaact information and a link to our blog.

### Video Stream

Coming soon.

### Dashboard

The dashboard contains a number of live graphs showing the output of the sensors connected to the system. It monitors seven parameters: total dissolved solids, air temperature, water level, humidity, pH, water temperature, and dissolved oxygen. The latest value from the sensors are also displayed on the top right corner of the corresponding graph card. When the values of a parameter is within the specific tolerances (see Control Panel below), the graph is green; else it is red. The timescale over which the graphs display data can be selected (between values of one hour, one day, or one week). Because the sensors are often missing data (*cough* electronics team), there is a switch to trim the time interval of the graphs to only that for which there is existing data.

### Control Panel

The control panel displays the current control configuration being used by the system.
- The **Tolerances** page specifies a range over which a certain monitored parameter (e.g. pH level) is considered "good." This determines the color of the corresponding graph in the dashboard, as well as alerts sent to certain "emergency contacts" should a parameter value go out of range.
- The **Backwashing** page refers to ~~the automatic reversal of the quantum fish field caused by buildup of marine nuclear waste~~. The backwashing hardware is currently not working.
- The **Fish feeder** page controls the fish feeder :brain:. The fish feeder is currently in development.
- The **Lights** page controls the lighting of individual parts of the system. The lights can be turned on, turned off, or set on a timer to turn on for a certain duration at a certain time of day.
- The **Water Pump** page controls the water pumps that feed into the grow beds. The pumps can be turned on, turned off, or set on a timer to pump for a specific time.

Logged in users will be able to change these configuration values and save their changes to the system.

### Settings

Coming soon.

# Why 2.0?

In ye olden days, members of the ESWNU AutoAquaponics team would have to remotely access (via VNC Viewer) a single computer connected directly to the system in order to monitor and control it. This rather clunky method meant that only one person could log in at a time; two people logged in at the same time could literally see the each other moving the computer's cursor. AutoAquaponics v2.0 is our answer to this issue. It allows multiple team members, plus the general public, to interact with the system (and with a much prettier user interface too!). The code for AutoAquaponics v1.0 can be found [here](https://github.com/ESW-NU/AutoAquaponics).
