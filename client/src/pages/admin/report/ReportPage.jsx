import { Box, Button, Typography } from "@mui/material";
import AdminBar from "../components/appbar/AdminBar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Fragment, forwardRef, useEffect, useState } from "react";
import ReportTable from "./ReportTable";
import { useGetOrdersQuery } from "../../../state/api/orderApi";
import { format } from "date-fns";
import idLocale from "date-fns/locale/id";
import Protect from "../Protect";
import Title from "../../../components/title/Title";

const DateButton = forwardRef(({ value, onClick }, ref) => (
  <Button variant="contained" color="primary" onClick={onClick} ref={ref}>
    {value}
  </Button>
));

const ReportPage = () => {
  Protect();

  const { data: orders } = useGetOrdersQuery();

  const [today, setToday] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const dateString = format(today, "dd MM yyyy", { locale: idLocale });
  const startString = format(startDate, "dd MM yyyy", { locale: idLocale });
  const endString = format(endDate, "dd MM yyyy", { locale: idLocale });

  const completeOrders = orders?.filter(
    (order) => order.paymentStatus === "settlement"
  );

  const ordersByDate = () => {
    const filtered = completeOrders?.filter((order) => {
      const orderDate = new Date(order.createdAt);

      return orderDate >= startDate && orderDate <= endDate;
    });

    return filtered;
  };

  const filteredOrders = ordersByDate();

  useEffect(() => {
    setToday(new Date());
  }, []);

  return (
    <Fragment>
      <Title title={"Admin Laporan"} />
      <AdminBar />

      <Box sx={{ position: "relative", top: 70 }}>
        {/* Function */}
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
          <Box
            sx={{ display: "flex", width: 400, justifyContent: "space-evenly" }}
          >
            {/* start */}
            <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
              <Typography align="center" fontWeight="bold">
                Dari
              </Typography>
              <DatePicker
                closeOnScroll={true}
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                customInput={<DateButton />}
                dateFormat="dd MM yyyy"
                maxDate={today}
              />
            </Box>

            {/* end */}
            <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
              <Typography align="center" fontWeight="bold">
                Sampai
              </Typography>
              <DatePicker
                closeOnScroll={true}
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                customInput={<DateButton />}
                dateFormat="dd MM yyyy"
                maxDate={today}
              />
            </Box>
          </Box>
        </Box>

        {/* Table */}
        <Box sx={{ p: 2 }}>
          <ReportTable
            orders={filteredOrders}
            start={startString}
            end={endString}
          />
        </Box>
      </Box>
    </Fragment>
  );
};

export default ReportPage;
