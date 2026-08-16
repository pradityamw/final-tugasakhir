import { Box, Button, Typography } from "@mui/material";
import SelectOptions from "./SelectOptions";
import { useEffect, useState } from "react";
import {
  useGetProvincesQuery,
  useGetCitiesQuery,
  useGetDistrictsQuery, // Impor hook baru
  useGetServicesQuery,
} from "../../../state/api/shipmentApi"; // Sesuaikan path ini
import { useSelector } from "react-redux";
import { useGetTokenMutation } from "../../../state/api/paymentApi"; // Sesuaikan path ini
import { useCartOrderMutation } from "../../../state/api/orderApi"; // Sesuaikan path ini
import { useNavigate } from "react-router-dom";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const Order = ({ subtotal, totalWeight, products }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [getToken, { isLoading, data: tokenData }] = useGetTokenMutation();
  const [cartOrder, { isSuccess, data: orderResponse, reset }] = useCartOrderMutation();

  // --- State terpusat untuk semua pilihan ---
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCourier, setSelectedCourier] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [address, setAddress] = useState("");

  // get name address
  const [provinceName, setProvinceName] = useState("");
  const [cityName, setCityName] = useState("");
  const [districtName, setDistrictName] = useState("");

  // --- Memanggil Hooks RTK Query ---
  const { data: provincesData, isLoading: isProvincesLoading } =
    useGetProvincesQuery();

  const { data: citiesData, isLoading: isCitiesLoading } = useGetCitiesQuery(
    selectedProvince,
    { skip: !selectedProvince }
  );

  const { data: districtsData, isLoading: isDistrictsLoading } =
    useGetDistrictsQuery(selectedCity, { skip: !selectedCity });

  const couriers = [
    { key: "jne", name: "JNE" },
    { key: "sicepat", name: "Sicepat" },
  ];

  const originDistrictId = "2174";

  const { data: servicesData, isLoading: isServicesLoading } =
    useGetServicesQuery(
      {
        origin: originDistrictId,
        destination: selectedDistrict,
        weight: totalWeight,
        courier: selectedCourier,
      },
      { skip: !selectedDistrict || totalWeight === "" || !selectedCourier }
    );

  const services = servicesData;

  // --- Handlers untuk mengubah pilihan ---
  const handleProvinceChange = (province) => {
    setSelectedProvince(province.id);
    setProvinceName(province.name);
    setSelectedCity("");
    setSelectedDistrict("");
    setSelectedCourier("");
    setSelectedService("");
  };

  const handleCityChange = (city) => {
    setSelectedCity(city.id);
    setCityName(city.name);
    setSelectedDistrict("");
    setSelectedCourier("");
    setSelectedService("");
  };

  const handleDistrictChange = (district) => {
    console.log("district : ", district);

    setSelectedDistrict(district.id);
    setDistrictName(district.name);
  };

  const handleCourierChange = (courierCode) => {
    setSelectedCourier(courierCode);
    setSelectedService("");
  };

  const handleServiceChange = (service) => {
    setSelectedService(service);
  };

  // --- Kalkulasi & Logika Pembayaran ---
  const shippingCost = selectedService?.cost || 0;
  const total = subtotal + shippingCost;
  const token = tokenData?.token;
  const id = Date.now();
  const shipment = `${provinceName}, ${cityName}, ${districtName}, ${address}`;

  const buyHandler = () => {
    if (!address) {
      return iziToast.error({
        title: "Error",
        message: "Masukan alamat",
        position: "topRight",
        timeout: 3000,
      });
    }

    const data = {
      orderId: id,
      amount: total,
      name: user?.name,
      email: user?.username,
      phone: user?.phone,
    };

    getToken(data);
  };

  useEffect(() => {
    if (token) {
      window.snap.pay(token, {
        onSuccess: (result) => {
          const data = {
            orderId: result.order_id,
            user: user?._id,
            address: address,
            phone: user?.phone || "12323",
            subtotal: subtotal,
            payment: total,
            paymentStatus: result.transaction_status,
            shipment: shipment,
            shippingCost: shippingCost,
            courier: `${selectedService?.code} - ${selectedService?.service}`,
            products: products?.map((product) => ({
              productId: product.productId,
              qty: product.qty,
              totalPrice: product.totalPrice,
              profit: product.profit,
            })),
          };

          cartOrder(data);
        },
        onPending: (result) => {
          const data = {
            orderId: result.order_id,
            user: user?._id,
            address: address,
            phone: user?.phone || "12323",
            subtotal: subtotal,
            payment: total,
            paymentStatus: result.transaction_status,
            shipment: shipment,
            shippingCost: shippingCost,
            courier: `${selectedService?.code} - ${selectedService?.service}`,
            products: products?.map((product) => ({
              productId: product.productId,
              qty: product.qty,
              totalPrice: product.totalPrice,
              profit: product.profit,
            })),
          };

          cartOrder(data);
        },
        onError: (error) => {
          iziToast.error({
            title: "Error",
            message: typeof error === "string" ? error : "Pembayaran gagal",
            position: "topRight",
            timeout: 3000,
          });
        },
        onClose: () => {
          iziToast.info({
            title: "Info",
            message: "Segera lakukan pembayaran",
            position: "topRight",
            timeout: 3000,
          });
        },
      });
    }
  }, [token]);

  useEffect(() => {
    const midtransScriptUrl = import.meta.env.VITE_MIDTRANS_URL;

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;

    const myMidtransClientKey = import.meta.env.VITE_MIDTRANS_KEY;
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  useEffect(() => {
    if (isSuccess) {
      iziToast.success({
        title: "Success",
        message: orderResponse?.message || "Pesanan berhasil dibuat",
        position: "topRight",
        timeout: 3000,
      });
      reset();
      navigate("/order");
    }
  }, [isSuccess, orderResponse, reset, navigate]);

  return (
    <Box
      sx={{
        width: { xs: "100%", md: "80%" },
        borderRadius: "10px",
        padding: "15px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        boxShadow: 6,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "5px",
        }}
      >
        <Typography fontWeight="bold" fontSize={18}>
          Subtotal
        </Typography>
        <Typography fontWeight="bold" fontSize={20}>
          Rp {subtotal && subtotal.toLocaleString("id-ID")}
        </Typography>
      </Box>

      <Typography fontWeight="bold">Alamat Pengiriman</Typography>

      <SelectOptions
        // Props untuk Provinsi
        provinces={provincesData || []}
        isProvincesLoading={isProvincesLoading}
        selectedProvinceValue={selectedProvince}
        onProvinceChange={handleProvinceChange}
        // Props untuk Kota/Kabupaten
        cities={citiesData || []}
        isCitiesLoading={isCitiesLoading}
        selectedCityValue={selectedCity}
        onCityChange={handleCityChange}
        // Props untuk Kecamatan
        districts={districtsData || []}
        isDistrictsLoading={isDistrictsLoading}
        selectedDistrictValue={selectedDistrict}
        onDistrictChange={handleDistrictChange}
        // Props untuk Kurir
        couriers={couriers}
        selectedCourierValue={selectedCourier}
        onCourierChange={handleCourierChange}
        // Props untuk Layanan
        services={services || []}
        isServicesLoading={isServicesLoading}
        selectedServiceValue={selectedService || ""}
        onServiceChange={handleServiceChange}
        // Props untuk Alamat
        addressValue={address}
        onAddressChange={setAddress}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "5px",
        }}
      >
        <Typography fontWeight="bold" fontSize={18}>
          Ongkir
        </Typography>
        <Typography fontWeight="bold" fontSize={20}>
          Rp {shippingCost.toLocaleString("id-ID")}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "5px",
        }}
      >
        <Typography fontWeight="bold" fontSize={18}>
          Total
        </Typography>
        <Typography fontWeight="bold" fontSize={20}>
          Rp {total.toLocaleString("id-ID")}
        </Typography>
      </Box>

      <Button
        variant="contained"
        onClick={buyHandler}
        disabled={!selectedService}
      >
        {isLoading ? "Memproses..." : "Beli"}
      </Button>
    </Box>
  );
};

export default Order;
