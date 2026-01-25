import { Box, Typography } from "@mui/material";
import Appbar from "../../components/appbar/Appbar";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Title from "../../components/title/Title";

const Confirm = () => {
  return (
    <Box>
      <Title title="Konfirmasi pembayaran" />
      <Appbar />
      <Box
        sx={{
          height: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CheckCircle color="primary" sx={{ fontSize: 130 }} />
        <Typography>Pesanan Berhasil disimpan</Typography>
      </Box>
    </Box>
  );
};

export default Confirm;
