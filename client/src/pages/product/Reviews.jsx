import { Box, Fade, Modal, Typography } from "@mui/material";
import React from "react";

const createMarkUp = (html) => {
  return { __html: html };
};

const Reviews = ({ open, close, reviews }) => {
  return (
    <Modal open={open} onClose={close}>
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: 300, md: 500 },
            height: 340,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "5px",
            p: 2,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {reviews?.map((review) => (
            <Box
              key={review._id}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                p: 2,
                borderRadius: "5px",
                boxShadow: 4,
              }}
            >
              <Typography fontWeight="bold">
                {review.user.substring(0, 3) + "***"}
              </Typography>
              <Typography
                variant="body2"
                dangerouslySetInnerHTML={createMarkUp(review.review)}
              />
            </Box>
          ))}
        </Box>
      </Fade>
    </Modal>
  );
};

export default Reviews;
