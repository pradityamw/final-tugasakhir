import {
  Box,
  Fade,
  IconButton,
  Modal,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useState } from "react";

const createMarkUp = (html) => {
  return { __html: html };
};

const Product = ({ open, close, productDetail, reset }) => {
  const product = productDetail && productDetail;

  const defaultImg = "http://dummyimage.com/650x650.png/cc0000/ffffff";

  const [imageIndex, setIndex] = useState(0);

  const left = () => {
    setIndex((imageIndex - 1 + product?.image.length) % product?.image.length);
  };

  const right = () => {
    setIndex((imageIndex + 1) % product?.image.length);
  };

  const closeHandler = () => {
    close();
  };

  return (
    <Modal open={open} onClose={close}>
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: 300, md: 700 },
            height: { xs: 500, md: 500 },
            overflow: "auto",
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box sx={{ position: "absolute", top: 0, right: -0 }}>
            <IconButton onClick={closeHandler} sx={{ bgcolor: "red" }}>
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
          </Box>

          <Box
            sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
          >
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
                }}
              >
                <img
                  src={
                    product?.image[imageIndex]
                      ? product?.image[imageIndex].link
                      : defaultImg
                  }
                  alt={product?.name}
                  style={{
                    height: "100%",
                    width: "100%",
                    borderRadius: "5px",
                    objectFit: "cover",
                  }}
                />
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  width: "350px",
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
            </Box>
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "start",
                justifyContent: "center",
              }}
            >
              <TableBody>
                <TableRow>
                  <TableCell>Nama Produk</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{product?.name}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Harga Produk</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>
                    Rp {parseFloat(product?.price).toLocaleString("id-ID")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Harga Beli</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>
                    Rp {parseFloat(product?.capital).toLocaleString("id-ID")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Harga Jual</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>
                    Rp {parseFloat(product?.profit).toLocaleString("id-ID")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Stok</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{product?.stock}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Berat</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{product?.weight} gram</TableCell>
                </TableRow>
              </TableBody>
            </Box>
          </Box>

          <Box
            sx={{ mt: 2 }}
            dangerouslySetInnerHTML={createMarkUp(product?.desc)}
          />
        </Box>
      </Fade>
    </Modal>
  );
};

export default Product;
