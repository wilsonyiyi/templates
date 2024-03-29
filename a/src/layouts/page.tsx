import React from "react";
import { Grid, Menu } from "@mui/material";

interface IProps {}
const Page: React.FC<IProps> = ({}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Menu open></Menu>
      </Grid>
      <Grid item xs={8}>
      </Grid>
    </Grid>
  );
};

export default Page;
