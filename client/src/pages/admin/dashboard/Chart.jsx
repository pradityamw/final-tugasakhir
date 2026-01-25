import { Grid, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Chart = ({ orders }) => {
  const productSales = {};
  const categorySales = {};

  orders?.forEach((order) => {
    order.products.forEach((product) => {
      const productName = product?.productId?.name;
      const category = product?.productId?.category;
      const quantity = product?.qty;

      if (!productSales[productName]) {
        productSales[productName] = 0;
      }

      productSales[productName] += quantity;

      if (!categorySales[category]) {
        categorySales[category] = 0;
      }

      categorySales[category] += quantity;
    });
  });

  const topProduct = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, sales]) => ({ name, sales }));

  const topCategory = Object.entries(categorySales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, sales]) => ({ name, sales }));

  return (
    <Grid container>
      <Grid
        item
        xs={12}
        md={12}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6">5 Produk Terlaris</Typography>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={topProduct}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#82CA9D" />
          </BarChart>
        </ResponsiveContainer>
      </Grid>

      <Grid
        item
        xs={12}
        md={12}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6"> 5 Kategori produk Terlaris</Typography>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={topCategory}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#82CA9D" />
          </BarChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  );
};

export default Chart;
