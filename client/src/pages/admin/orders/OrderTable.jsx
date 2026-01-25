import {
  Box,
  Button,
  Input,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useInputResiMutation } from "../../../state/api/orderApi";
import iziToast from "izitoast";
import CircularProgress from "@mui/material/CircularProgress";

const columns = [
  { label: "No", width: 30 },
  { label: "Order Id", width: 100 },
  { label: "Pelanggan", width: 100 },
  { label: "Produk", width: 100 },
  { label: "Alamat", width: 100 },
  { label: "Layanan", width: 100 },
  { label: "Ongkir", width: 100 },
  { label: "Pengiriman", width: 100 },
  { label: "No HP", width: 100 },
  { label: "Resi", width: 100 },
  { label: "Aksi", width: 100 },
];

const OrderTable = ({ orders }) => {
  const [inputResi, { data, isSuccess, isLoading, error, reset }] =
    useInputResiMutation();

  const [resiInputs, setResiInputs] = useState({});

  const inputHandler = (orderId, value) => {
    setResiInputs((prev) => ({
      ...prev,
      [orderId]: value,
    }));
  };

  const updateResi = (orderId) => {
    const data = {
      resi: resiInputs[orderId],
    };

    inputResi({ id: orderId, body: data });
  };

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
      iziToast.error({
        title: "Error",
        message: error?.data.message,
        position: "topRight",
        timeout: 3000,
      });

      reset();
    }
  }, [isSuccess, error, data]);
  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  align="center"
                  key={index}
                  sx={{ minWidth: column.width }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders?.map((order, index) => (
              <TableRow key={order._id}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">{order.orderId}</TableCell>
                <TableCell align="center">{order.user.name}</TableCell>
                <TableCell align="center">
                  {order.products?.map((product, index) => (
                    <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
                      <p>
                        <strong>{product.productId.name}</strong>
                      </p>
                      <p>
                        <strong>{product.qty} item</strong>
                      </p>
                    </Box>
                  ))}
                </TableCell>
                <TableCell align="center">{order.address}</TableCell>
                <TableCell align="center">{order.shipment}</TableCell>
                <TableCell align="center">
                  Rp {parseFloat(order.shippingCost).toLocaleString("id-ID")}
                </TableCell>
                <TableCell align="center">{order.orderStatus}</TableCell>
                <TableCell align="center">{order.user.phone}</TableCell>
                <TableCell align="center">
                  <Input
                    placeholder="Isi Resi"
                    value={
                      resiInputs[order._id] !== undefined
                        ? resiInputs[order._id]
                        : order.resi || ""
                    }
                    onChange={(e) => inputHandler(order._id, e.target.value)}
                  />
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => updateResi(order._id)}
                  >
                    {isLoading ? <CircularProgress size={20} /> : "simpan"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default OrderTable;
