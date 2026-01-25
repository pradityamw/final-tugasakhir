import { Box, Button, IconButton, Portal, Typography } from "@mui/material";

import Appbar from "../../components/appbar/Appbar";
import Footer from "../../components/footer/Footer";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { orange } from "@mui/material/colors";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useState } from "react";
import Order from "./Order";
import { useParams } from "react-router-dom";
import { useGetProductQuery } from "../../state/api/productApi";
import Title from "../../components/title/Title";
import Reviews from "./Reviews";

const createMarkUp = (html) => {
  return { __html: html };
};

const DetailProduct = () => {
  const params = useParams();

  const defaultImg = "http://dummyimage.com/650x650.png/cc0000/ffffff";

  const [open, setOpen] = useState(false);

  const { data, error, isLoading } = useGetProductQuery(params?.name);

  const [imageIndex, setIndex] = useState(0);

  const left = () => {
    setIndex((imageIndex - 1 + data?.image.length) % data?.image.length);
  };

  const right = () => {
    setIndex((imageIndex + 1) % data?.image.length);
  };

  return (
    <Box>
      <Title title={`${params?.name}`} />
      <Appbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          minHeight: "85vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            flex: 2,
            alignItems: { xs: "center", md: "start" },
          }}
        >
          {/* Image */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
            }}
          >
            <Box
              sx={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                height: { xs: 300, md: 300 },
                width: { xs: 300, md: 300 },
              }}
            >
              <img
                src={
                  data?.image[imageIndex]
                    ? data?.image[imageIndex].link
                    : defaultImg
                }
                alt={data?.name}
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: "10px",
                  objectFit: "cover",
                }}
              />
            </Box>

            <Box
              sx={{
                position: "absolute",
                width: { xs: "330px", md: "530px" },
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <IconButton onClick={left}>
                <ArrowLeftIcon />
              </IconButton>

              <IconButton onClick={right}>
                <ArrowRightIcon />
              </IconButton>
            </Box>

            <Button
              sx={{ mt: 2 }}
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={() => setOpen(true)}
            >
              {`Reviews ${data?.reviews.length}`}
            </Button>
          </Box>

          {/* Detail */}
          <Box
            sx={{
              display: "flex",
              flex: 1,
              p: 2,
              gap: 1,
              flexDirection: "column",
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              {data?.name}
            </Typography>

            <Typography
              sx={{ display: "flex", alignItems: "center", color: "grey" }}
            >
              <StarRoundedIcon sx={{ color: orange[500] }} /> {data?.rating}{" "}
              dari ({data?.reviews.length} reviewrs)
            </Typography>

            <Typography sx={{ color: "gray" }}>{data?.weight} gram</Typography>

            <Typography fontWeight="bold" variant="h5">{`Rp ${parseFloat(
              data?.price
            ).toLocaleString("id-ID")}`}</Typography>

            <Typography dangerouslySetInnerHTML={createMarkUp(data?.desc)} />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flex: 1,
            p: { xs: 0, md: 2 },
            justifyContent: "center",
          }}
        >
          <Order product={data} />
        </Box>
      </Box>
      <Reviews
        reviews={data?.reviews}
        open={open}
        close={() => setOpen(false)}
      />
      <Footer />
    </Box>
  );
};

export default DetailProduct;
