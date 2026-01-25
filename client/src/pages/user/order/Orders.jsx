import { Box } from "@mui/material";
import Appbar from "../../../components/appbar/Appbar";
import Footer from "../../../components/footer/Footer";
import ListOrders from "./ListOrders";
import Title from "../../../components/title/Title";
import Protect from "../Protect";
import Chat from "../chat/Chat";

const Orders = () => {
  Protect();

  return (
    <Box>
      <Title title={"Pesanan"} />
      <Appbar />

      <Box sx={{ minHeight: 620, padding: "30px" }}>
        <ListOrders />
      </Box>

      <Chat />

      <Footer />
    </Box>
  );
};

export default Orders;
