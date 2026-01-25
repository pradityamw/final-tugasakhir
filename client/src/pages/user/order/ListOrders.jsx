import {
  Box,
  Button,
  Fade,
  IconButton,
  Input,
  Modal,
  Paper,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import MessageIcon from "@mui/icons-material/Message";
import { useUpdateStatusMutation } from "../../../state/api/paymentApi";
import { useGetMyOrderMutation } from "../../../state/api/orderApi";
import { useEffect, useState } from "react";
import iziToast from "izitoast";
import Reivew from "./Reivew";

const Headers = [
  { name: "Order" },
  { name: "Detail" },
  { name: "Bill" },
  { name: "Date" },
  { name: "Status" },
  { name: "Shipment" },
  { name: "Cost" },
  { name: "Resi" },
  { name: "Action", width: 250 },
];

const ListOrders = () => {
  const [updateStatus, { isSuccess, isLoading, data, error }] =
    useUpdateStatusMutation();
  const [getMyOrder, { data: orders }] = useGetMyOrderMutation();

  const updateHandler = (id) => updateStatus(id);

  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState("");

  const reviewHandler = (id) => {
    for (const order of orders) {
      for (const product of order.products) {
        if (product.productId._id === id) {
          setProduct(product.productId);
        }
      }
    }
    setOpen(true);
  };

  useEffect(() => {
    if (isSuccess) {
      iziToast.success({
        title: " Success",
        message: data?.message,
        position: "topRight",
        timeout: 3000,
      });
      getMyOrder();
    }
    if (error) {
      iziToast.error({
        title: " Error",
        message: error?.data.error,
        position: "topRight",
        timeout: 3000,
      });
    }
  }, [isSuccess, data, error]);

  useEffect(() => {
    getMyOrder();
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Pesanan Kamu
        </Typography>

        <Box>
          <Input type="text" placeholder="Search By Order" />
        </Box>
      </Box>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 570 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {Headers.map((item) => (
                  <TableCell
                    key={item.name}
                    align="center"
                    sx={{ width: item.width }}
                  >
                    {item.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders?.map((item) => {
                const date = new Date(item.createdAt);

                const options = {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                };
                const formattedDate = date.toLocaleDateString("id-ID", options);
                return (
                  <TableRow key={item._id}>
                    <TableCell align="center">{item.orderId}</TableCell>
                    <TableCell
                      align="center"
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      {item.products.map((product) => (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            gap: 2,
                            justifyContent: "space-between",
                          }}
                          key={product._id}
                        >
                          <Box>
                            <Typography align="left">
                              Item : {product.productId.name}
                            </Typography>
                            <Typography align="left">
                              Jumlah : {product.qty}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Button
                              startIcon={<MessageIcon />}
                              variant="contained"
                              color="success"
                              onClick={() =>
                                reviewHandler(product.productId._id)
                              }
                              disabled={
                                item.paymentStatus === "expire" ||
                                item.paymentStatus === "pending"
                              }
                            >
                              review
                            </Button>
                          </Box>
                        </Box>
                      ))}
                    </TableCell>
                    <TableCell align="center">{`Rp ${parseFloat(
                      item.payment
                    ).toLocaleString("id-ID")}`}</TableCell>
                    <TableCell align="center">{formattedDate}</TableCell>
                    <TableCell align="center">{item.paymentStatus}</TableCell>
                    <TableCell align="center">{item.orderStatus}</TableCell>
                    <TableCell align="center">{`Rp ${parseFloat(
                      item.shippingCost
                    ).toLocaleString("id-ID")}`}</TableCell>
                    <TableCell align="center">
                      {item.resi ? item.resi : "-"}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        startIcon={<CloudSyncIcon />}
                        variant="contained"
                        color="error"
                        onClick={() => updateHandler(item.orderId)}
                        disabled={
                          item.paymentStatus === "settlement" ||
                          item.paymentStatus === "expire"
                        }
                      >
                        {isLoading ? "..." : "update"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Reivew open={open} close={() => setOpen(false)} product={product} />
      </Paper>
    </>
  );
};

export default ListOrders;
