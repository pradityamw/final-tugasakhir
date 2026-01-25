import { Box } from "@mui/material";
import Appbar from "../../components/appbar/Appbar";
import Footer from "../../components/footer/Footer";
import Products from "../product/Products";
import Title from "../../components/title/Title";
import Sliders from "./Sliders";
import Chat from "../user/chat/Chat";

const Home = () => {
  return (
    <div>
      <Title title={"Home"} />
      <Appbar />

      <Box
        sx={{
          minHeight: 700,
          m: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        {/* <Sliders /> */}
        <Products />
      </Box>

      <Chat />

      <Footer />
    </div>
  );
};

export default Home;
