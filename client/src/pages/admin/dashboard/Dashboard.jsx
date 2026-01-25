import { Fragment } from "react";
import AdminBar from "../components/appbar/AdminBar";
import { Box, Grid } from "@mui/material";
import Data from "./Data";
import Transactions from "./Transactions";
import { useGetOrdersQuery } from "../../../state/api/orderApi";
import { useGetProductsQuery } from "../../../state/api/productApi";
import { useGetUsersQuery } from "../../../state/api/userApi";
import Chart from "./Chart";
import Protect from "../Protect";
import Title from "../../../components/title/Title";

const Dashboard = () => {
  Protect();

  const { data: orders } = useGetOrdersQuery();
  const { data: products } = useGetProductsQuery();
  const { data: users } = useGetUsersQuery();
  return (
    <Fragment>
      <AdminBar />
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
          flexDirection: "column",
          gap: 2,
          position: "relative",
          top: 70,
        }}
      >
        <Title title={"Admin Dashboard"} />
        <Data orders={orders} products={products} users={users} />

        <Grid container>
          <Grid item md={6} sx={{ p: 1 }}>
            <Transactions orders={orders} />
          </Grid>

          <Grid item md={6} sx={{ p: 1 }}>
            <Chart orders={orders} />
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
};

export default Dashboard;
