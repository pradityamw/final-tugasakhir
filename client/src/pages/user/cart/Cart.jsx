import { Box, IconButton, Typography } from "@mui/material";
import Appbar from "../../../components/appbar/Appbar";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import Order from "./Order";
import {
  useDeleteProductMutation,
  useMyCartQuery,
} from "../../../state/api/cartApi";
import { useEffect, useState } from "react";
import iziToast from "izitoast";
import Title from "../../../components/title/Title";
import Protect from "../Protect";
import Chat from "../chat/Chat";

const Cart = () => {
  Protect();

  const defaultImg = "http://dummyimage.com/650x650.png/cc0000/ffffff";

  const { data } = useMyCartQuery();
  const [deleteProduct, { data: message, isSuccess, isLoading, error }] =
    useDeleteProductMutation();

  const products = data?.products;

  const [qty, setQty] = useState({});
  const [price, setPrice] = useState({});
  const [weight, setWeight] = useState({});

  const updatePrice = (productId, newQty) => {
    setPrice((prevPrice) => ({
      ...prevPrice,
      [productId]:
        products.find((p) => p.productId._id === productId).productId.price *
        newQty,
    }));
  };

  const updateWeight = (productId, newQty) => {
    setWeight((prevWeight) => ({
      ...prevWeight,
      [productId]:
        products.find((p) => p.productId._id === productId).productId.weight *
        newQty,
    }));
  };

  const increase = (productId) => {
    setQty((prevQty) => {
      const newQty = { ...prevQty };

      if (
        newQty[productId] <
        products.find((p) => p.productId._id === productId).productId.stock
      ) {
        newQty[productId] += 1;
        updatePrice(productId, newQty[productId]);
        updateWeight(productId, newQty[productId]);
      }

      return newQty;
    });
  };

  const decrease = (productId) => {
    setQty((prevQty) => {
      const newQty = { ...prevQty };

      if (newQty[productId] > 1) {
        newQty[productId] -= 1;
        updatePrice(productId, newQty[productId]);
        updateWeight(productId, newQty[productId]);
      }

      return newQty;
    });
  };

  const deleteHandler = (productId) => deleteProduct(productId);

  useEffect(() => {
    const intialQty = {};
    const intialPrice = {};
    const initialWeight = {};

    products?.forEach((product) => {
      intialQty[product.productId._id] = product.qty;
      intialPrice[product.productId._id] =
        product.productId.price * product.qty;
      initialWeight[product.productId._id] =
        product.productId.weight * product.qty;
    });

    setQty(intialQty);
    setPrice(intialPrice);
    setWeight(initialWeight);
  }, [products]);

  useEffect(() => {
    if (isSuccess) {
      iziToast.success({
        title: "Success",
        message: message?.message,
        position: "topRight",
        timeout: 3000,
      });
    }

    if (error) {
      iziToast.success({
        title: "Success",
        message: error?.data.error,
        position: "topRight",
        timeout: 3000,
      });
    }
  }, [isSuccess, message, error]);

  const calculateTotalPrice = () => {
    return Object.values(price).reduce(
      (acc, currentPrice) => acc + currentPrice,
      0
    );
  };

  const calculateTotalWeight = () => {
    return Object.values(weight).reduce(
      (acc, currentWeight) => acc + currentWeight,
      0
    );
  };

  const orderProducts = () => {
    return products?.map((product) => ({
      productId: product?.productId._id,
      qty: qty[product?.productId._id],
      totalPrice: price[product?.productId._id],
      profit: product?.productId.profit * qty[product?.productId._id],
    }));
  };

  return (
    <>
      <Title title={"Keranjang Belanja"} />
      <Appbar />
      <Box sx={{ margin: "30px" }}>
        <Typography variant="h6" fontWeight="bold">
          Kerangjang Belanja
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 4, md: 0 },
          }}
        >
          <Box sx={{ display: "flex", flexWrap: "wrap", flex: 2 }}>
            {products && products.length > 0 ? (
              products?.map((product, index) => (
                <Box key={index} sx={{ display: "flex", width: "100%" }}>
                  <Box
                    sx={{
                      flex: 2,
                      display: "flex",
                      alignItems: "start",
                      padding: "20px",
                      gap: "20px",
                    }}
                  >
                    <img
                      src={
                        product?.productId.image[0]
                          ? product?.productId.image[0].link
                          : defaultImg
                      }
                      alt="img"
                      style={{
                        height: "120px",
                        width: "120px",
                        objectFit: "cover",
                      }}
                    />

                    <Box
                      sx={{
                        width: "80%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <Typography fontWeight="bold">
                        {product?.productId.name}
                      </Typography>
                      <Typography fontWeight="bold">{`Rp ${parseFloat(
                        price[product?.productId._id]
                      ).toLocaleString("id-ID")}`}</Typography>
                      <Typography fontSize={14} fontStyle="italic">
                        {weight[product?.productId._id]} gram
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          gap: "15px",
                          padding: "5px",
                          justifyContent: "end",
                        }}
                      >
                        <Box sx={{ alignContent: "center" }}>
                          <IconButton
                            onClick={() =>
                              deleteHandler(product?.productId._id)
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            gap: "15px",
                            padding: "2px",
                          }}
                        >
                          <IconButton
                            onClick={() => decrease(product?.productId._id)}
                          >
                            <RemoveIcon />
                          </IconButton>

                          <Box
                            sx={{
                              width: 50,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {qty[product?.productId._id]}
                          </Box>

                          <IconButton
                            onClick={() => increase(product?.productId._id)}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography>Yek isi kerangkang Belanja kamu</Typography>
            )}
          </Box>

          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "start",
              justifyContent: "center",
            }}
          >
            <Order
              subtotal={calculateTotalPrice()}
              totalWeight={calculateTotalWeight()}
              products={orderProducts()}
            />
          </Box>
        </Box>
      </Box>

      <Chat />
    </>
  );
};

export default Cart;
