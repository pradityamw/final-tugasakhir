import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import EditIcon from "@mui/icons-material/Edit";
import RemoveIcon from "@mui/icons-material/Remove";
import { blue, orange, red, yellow } from "@mui/material/colors";
import {
  useDeleteProductMutation,
  useGetProductQuery,
} from "../../../state/api/productApi";
import { useEffect, useState } from "react";
import iziToast from "izitoast";
import CircularProgress from "@mui/material/CircularProgress";
import Product from "./Product";
import { useNavigate } from "react-router-dom";
import Reviews from "./Reviews";

const Products = ({ product }) => {
  const defaultImg = "http://dummyimage.com/650x650.png/cc0000/ffffff";

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [show, setShow] = useState(false);
  const [reviews, setReviews] = useState("");

  const [deleteProduct, { data, isSuccess, error, isLoading, reset }] =
    useDeleteProductMutation();

  const {
    data: productDetail,
    isLoading: prodLoading,
    isSuccess: prodSuccess,
  } = useGetProductQuery(name, {
    skip: !name,
  });

  const deleteHandler = (id) => deleteProduct(id);

  const detailHanlder = (name) => {
    setName(name), setOpen(true);
  };

  const showReview = (review) => {
    setReviews(review);
    setShow(true);
  };

  const editPage = (name) => navigate(`/admin-produk/edit/${name}`);

  useEffect(() => {
    if (isSuccess) {
      iziToast.success({
        title: "Success",
        message: data?.message,
        position: "topRight",
        timeout: 3000,
      });

      reset();
    }

    if (error) {
      iziToast.success({
        title: "Success",
        message: error?.data.message,
        position: "topRight",
        timeout: 3000,
      });

      reset();
    }
  }, [isSuccess, error, data]);

  return (
    <Card sx={{ width: { xs: 150, md: 200 } }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height={150}
          image={
            product.image && product.image[0]
              ? product.image[0].link
              : defaultImg
          }
          sx={{ "&:hover": { cursor: "pointer" } }}
          onClick={() => detailHanlder(product.name)}
        />
      </CardActionArea>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: { xs: 0, md: 1 },
          }}
        >
          <Typography fontWeight="bold" align="center" fontSize={14}>
            {product.name.substring(0, 23) + "..."}
          </Typography>
          <Typography
            fontWeight="bold"
            align="center"
            fontSize={12}
            fontStyle="italic"
          >
            Rp {parseFloat(product.price).toLocaleString("id-ID")}
          </Typography>

          <Stack spacing={2}>
            <Rating value={product.rating} readOnly />
          </Stack>
        </Box>
      </CardContent>
      <CardActions>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: { xs: 1, md: 2 },
          }}
        >
          <IconButton onClick={() => showReview(product.reviews)}>
            <ChatIcon sx={{ color: orange[500] }} />
          </IconButton>

          <IconButton onClick={() => editPage(product.name)}>
            <EditIcon sx={{ color: yellow[800] }} />
          </IconButton>

          <IconButton onClick={() => deleteHandler(product._id)}>
            {isLoading ? (
              <CircularProgress size={20} />
            ) : (
              <RemoveIcon sx={{ color: red[800] }} />
            )}
          </IconButton>
        </Box>
      </CardActions>
      <Product
        open={open}
        close={() => setOpen(false)}
        productDetail={productDetail}
      />
      <Reviews open={show} close={() => setShow(false)} reviews={reviews} />
    </Card>
  );
};

export default Products;
