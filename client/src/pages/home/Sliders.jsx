import { Box, Paper } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import React from "react";
import { useGetStoreDataQuery } from "../../state/api/storeApi";

const Sliders = () => {
  const { data } = useGetStoreDataQuery();

  const images = data?.sliders;

  return (
    <Box sx={{ width: "98%", display: "flex", justifyContent: "center" }}>
      <Carousel sx={{ width: "90%" }} animation="slide" duration={3000}>
        {images?.map((image, index) => (
          <Paper
            key={index}
            sx={{ width: "100%", height: { xs: 150, md: 300 } }}
          >
            <img
              src={image.link}
              alt={`Image - ${index}`}
              style={{ height: "100%", width: "100%", objectFit: "cover" }}
              loading="lazy"
            />
          </Paper>
        ))}
      </Carousel>
    </Box>
  );
};

export default Sliders;
