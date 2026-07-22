import { Box, Button } from "@mui/material";
import Appbar from "../../../components/appbar/Appbar";
import Footer from "../../../components/footer/Footer";
import ListOrders from "./ListOrders";
import Title from "../../../components/title/Title";
import Protect from "../Protect";
import Chat from "../chat/Chat";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  Protect();
  const navigate = useNavigate();

  return (
    <Box>
      <Title title={"Pesanan"} />
      <Appbar />

      <Box sx={{ minHeight: 620, padding: "30px" }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          variant="text"
          sx={{ textTransform: "none", color: "text.secondary", mb: 1 }}
        >
          Kembali
        </Button>
        <ListOrders />
      </Box>

      <Chat />

      <Footer />
    </Box>
  );
};

export default Orders;
