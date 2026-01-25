import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Fragment, useRef } from "react";
import * as XLSX from "xlsx";

const columns = [
  {
    label: "No",
    width: 30,
  },
  {
    label: "Order ID",
    width: 100,
  },
  {
    label: "Tanggal",
    width: 100,
  },
  {
    label: "Pelanggan",
    width: 100,
  },
  {
    label: "Produk",
    width: 100,
  },
  {
    label: "Jumlah",
    width: 100,
  },
  {
    label: "Harga",
    width: 100,
  },
  {
    label: "Ongkir",
    width: 100,
  },
  {
    label: "Total Harga",
    width: 100,
  },
  {
    label: "Profit",
    width: 100,
  },
  {
    label: "Total Profit",
    width: 100,
  },
];

const ReportTable = ({ orders, start, end }) => {
  const tableRef = useRef(null);

  const convertToExcel = () => {
    if (tableRef.current) {
      const workbook = XLSX.utils.book_new();
      const table = tableRef.current;
      const tableData = XLSX.utils.table_to_sheet(table);

      XLSX.utils.book_append_sheet(workbook, tableData, "Sheet1");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const fileName = `Laporan ${start}-${end}.xlsx`;

      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(data, fileName);
      } else {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(data);
        link.download = fileName;
        link.click();
      }
    }
  };

  return (
    <Fragment>
      <Box sx={{ display: "flex", justifyContent: "end", mb: 1 }}>
        <Button variant="contained" color="success" onClick={convertToExcel}>
          download
        </Button>
      </Box>
      <Paper>
        <TableContainer>
          <Table ref={tableRef}>
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    key={index}
                    align="center"
                    sx={{ minWidth: column.width }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders?.map((order, index) => {
                const productLength = order.products.length;

                const totalProfit = order.products?.reduce(
                  (acc, product) => acc + product.profit,
                  0
                );

                return (
                  <Fragment>
                    <TableRow key={index}>
                      <TableCell rowSpan={productLength} align="center">
                        {index + 1}
                      </TableCell>
                      <TableCell rowSpan={productLength} align="center">
                        {order.orderId}
                      </TableCell>
                      <TableCell rowSpan={productLength} align="center">
                        {new Date(order.createdAt).toLocaleDateString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell rowSpan={productLength} align="center">
                        {order.user.name}
                      </TableCell>
                      <TableCell align="center">
                        {order.products[0].productId.name}
                      </TableCell>
                      <TableCell align="center">
                        {order.products[0].qty}
                      </TableCell>
                      <TableCell align="center">
                        Rp {""}
                        {parseFloat(
                          order.products[0].productId.price
                        ).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell rowSpan={productLength} align="center">
                        Rp{" "}
                        {parseFloat(order.shippingCost).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell rowSpan={productLength} align="center">
                        Rp {parseFloat(order.subtotal).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell align="center">
                        Rp {""}
                        {parseFloat(order.products[0].profit).toLocaleString(
                          "id-ID"
                        )}
                      </TableCell>
                      <TableCell rowSpan={productLength} align="center">
                        Rp {parseFloat(totalProfit).toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                    {order.products.slice(1).map((order, index) => (
                      <TableRow key={order.productId._id}>
                        <TableCell align="center">
                          {order.productId.name}
                        </TableCell>
                        <TableCell align="center">{order.qty}</TableCell>
                        <TableCell align="center">
                          Rp{" "}
                          {parseFloat(order.productId.price).toLocaleString(
                            "id-ID"
                          )}
                        </TableCell>
                        <TableCell align="center">
                          Rp {parseFloat(order.profit).toLocaleString("id-ID")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </Fragment>
                );
              })}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TableCell colSpan={11}>
                  <Box sx={{ width: "100%" }}>
                    <p>{`Tanggal : ${start} - ${end}`} </p>
                  </Box>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
    </Fragment>
  );
};

export default ReportTable;
