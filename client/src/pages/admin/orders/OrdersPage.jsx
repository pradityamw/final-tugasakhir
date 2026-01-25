import { Box, Input } from "@mui/material";
import AdminBar from "../components/appbar/AdminBar";
import OrderTable from "./OrderTable";
import { useGetOrdersQuery } from "../../../state/api/orderApi";
import { Fragment, useState } from "react";
import Protect from "../Protect";
import Title from "../../../components/title/Title";

const OrdersPage = () => {
  Protect();

  const { data } = useGetOrdersQuery();

  const completeOrder = data?.filter((d) => d.paymentStatus === "settlement");

  const [searchTerm, setSearchTerm] = useState("");

  const searchFunction = (e) => {
    setSearchTerm(e.target.value);
  };

  const filtered = (order) => {
    return order.orderId.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const filteredOrders = completeOrder?.filter(filtered);

  return (
    <Fragment>
      <Title title={"Admin Pesanan"} />
      <AdminBar />

      <Box sx={{ position: "relative", top: 70 }}>
        {/* search function */}
        <Box sx={{ p: 2 }}>
          <Input
            placeholder="Cari Pesanan"
            sx={{ p: 1 }}
            value={searchTerm}
            onChange={searchFunction}
          />
        </Box>

        <Box sx={{ p: 2 }}>
          <OrderTable orders={filteredOrders} />
        </Box>
      </Box>
    </Fragment>
  );
};

export default OrdersPage;
