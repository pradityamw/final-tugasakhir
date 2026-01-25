import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const columns = [
  { id: 1, label: "No", minWidth: 30 },
  { id: 2, label: "Order", minWidth: 100 },
  { id: 3, label: "Pelanggan", minWidth: 150 },
  { id: 5, label: "Tanggal", minWidth: 150 },
  { id: 6, label: "Status Pembayaran", minWidth: 150 },
];

const Transactions = ({ orders }) => {
  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                align="center"
                key={column.id}
                sx={{ width: column.minWidth }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {orders?.map((order, index) => (
            <TableRow key={index}>
              <TableCell align="center">{index + 1}</TableCell>
              <TableCell align="center">{order.orderId}</TableCell>
              <TableCell align="center">{order.user.name}</TableCell>
              <TableCell align="center">
                {new Date(order.createdAt).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
              <TableCell align="center">{order.paymentStatus}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default Transactions;
