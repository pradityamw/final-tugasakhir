import React, { Fragment } from "react";
import AdminBar from "../components/appbar/AdminBar";
import { useGetStoreDataQuery } from "../../../state/api/storeApi";
import { Grid, Typography } from "@mui/material";
import SettingStore from "./SettingStore";
import SettingAdmin from "./SettingAdmin";
import Title from "../../../components/title/Title";

const SettingPage = () => {
  const { data } = useGetStoreDataQuery();

  return (
    <Fragment>
      <Title title="Setting" />
      <AdminBar />

      <Grid
        container
        sx={{
          position: "relative",
          top: 80,
          pl: { xs: 1, md: 4 },
          pr: { xs: 1, md: 4 },
        }}
      >
        {/* <Grid item xs={12} md={6} sx={{ p: { xs: 1, md: 4 } }}>
          <Typography>Data Toko</Typography>

          <SettingStore store={data} />
        </Grid> */}

        <Grid item xs={12} md={6} sx={{ p: { xs: 1, md: 4 } }}>
          <Typography>Data Admin</Typography>

          <SettingAdmin />
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default SettingPage;
