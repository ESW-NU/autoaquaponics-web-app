import React from "react";
import { NavLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import "../CSS/pages.css"

const systemCAD = require("../Lib/PlumbingCADclear.png");


export const Home = () => {
  return (
    <div className="Pages">
      <Grid
        container
        columns={6}
        direction='row-reverse'
        spacing={0}
        justifyContent='center'
        alignItems='center'
        className="borderwoo"
      >
        <Grid item lg={3} className="borderwoo">
            <Typography variant="h1">NORTHWESTERN ESW AUTOAQUAPONICS</Typography>
            <Typography variant="h3">
              A fully automated aquaponic system in that can grow both fish and
              plants unattended for one month and be
              <NavLink to="/dashboard">monitored</NavLink> &
              <NavLink to="/control-panel">controlled</NavLink>
              remotely
            </Typography>
        </Grid>
        <Grid item lg={3} className="borderwoo">
          <div className="borderwoo hideoverflow">
            <img src={systemCAD} className="borderwoo image" />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};
// yes