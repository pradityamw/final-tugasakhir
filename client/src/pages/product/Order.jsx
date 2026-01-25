import {
  Box,
  Button,
  IconButton,
  Typography,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SelectOptions from "./SelectOptions";
import { useEffect, useState } from "react";
import {
  useGetCitiesQuery,
  useGetDistrictsQuery,
  useGetProvincesQuery,
  useGetServicesQuery,
} from "../../state/api/shipmentApi";
import { useSelector } from "react-redux";
import iziToast from "izitoast";
import { useGetTokenMutation } from "../../state/api/paymentApi";
import { useCreateOrderMutation } from "../../state/api/orderApi";
import { useCreateCartMutation } from "../../state/api/cartApi";

const Order = ({ product }) => {
  const { isAuth, user } = useSelector((state) => state.auth);
  const [getToken, { isLoading, data: tokenData }] = useGetTokenMutation();
  const [createOrder, { isSuccess, reset }] = useCreateOrderMutation();

  const [qty, setQty] = useState(1);
  const [subtotal, setSubtotal] = useState(0);

  // --- State terpusat untuk semua pilihan ---
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCourier, setSelectedCourier] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [address, setAddress] = useState("");
  const [totalWeight, setTotalWeight] = useState("");

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
      { skip: !selectedCity || !totalWeight || !selectedCourier }
    );

  const [
    createCart,
    { data: message, isSuccess: cartSuccess, isLoading: cartLoading, error },
  ] = useCreateCartMutation();

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

  const increaseQty = () => {
    if (qty < product?.stock) {
      setQty(qty + 1);
      setSubtotal(product?.price * (qty + 1));
    }
  };

  const decreaseQty = () => {
    if (qty > 1) {
      setQty(qty - 1);
      setSubtotal(product?.price * (qty - 1));
    }
  };

  const cartHandler = () => {
    if (!isAuth) {
      return iziToast.error({
        title: "Error",
        message: "Login dulu",
        position: "topRight",
        timeout: 3000,
      });
    }

    const data = {
      productId: product?._id,
      qty: qty,
    };

    createCart(data);
  };

  const buyHandler = () => {
    if (!isAuth) {
      return iziToast.error({
        title: "Error",
        message: "Login dulu",
        position: "topRight",
        timeout: 3000,
      });
    }

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
    if (product) {
      setSubtotal(product?.price);
      setTotalWeight(product?.weight);
    }
  }, [product]);

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
            products: [
              {
                productId: product?._id,
                qty: qty,
                totalPrice: subtotal,
                profit: product?.price * qty,
              },
            ],
          };

          createOrder(data);
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
            shippingCost: cost,
            courier: `${selectedService?.code} - ${selectedService?.service}`,
            products: [
              {
                productId: product?._id,
                qty: qty,
                totalPrice: subtotal,
                profit: product?.profit * qty,
              },
            ],
          };

          createOrder(data);

          window.location.href = "/confirmation";
        },
        onError: (error) => {
          iziToast.error({
            title: "Error",
            message: error,
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
      reset();
    }
  }, [isSuccess, reset]);

  useEffect(() => {
    if (cartSuccess) {
      iziToast.success({
        title: "Success",
        message: message?.message,
        position: "topRight",
        timeout: 3000,
      });
    }

    if (error) {
      // iziToast.error({
      //   title: "Error",
      //   message: error?.data.error,
      //   position: "topRight",
      //   timeout: 3000,
      // });

      console.log(error);
    }
  }, [message, cartSuccess, cartLoading, error]);

  return (
    <Paper
      elevation={3}
      sx={{
        width: { xs: "95%", md: "80%" }, // Sedikit penyesuaian untuk mobile
        p: { xs: 2, md: 3 }, // Padding responsif
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Gunakan <Stack> untuk mengatur jarak antar bagian */}
      <Stack spacing={2.5}>
        {/* --- BAGIAN 1: ATUR JUMLAH & SUBTOTAL --- */}
        <Box>
          <Typography variant="h6" fontWeight="bold" mb={1}>
            Atur Jumlah
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <IconButton
                size="small"
                onClick={decreaseQty}
                disabled={qty <= 1}
              >
                <RemoveIcon />
              </IconButton>
              <Typography
                sx={{
                  width: 40,
                  textAlign: "center",
                  border: "1px solid #ddd",
                  borderRadius: 1,
                  p: "4px 0",
                }}
              >
                {qty}
              </Typography>
              <IconButton
                size="small"
                onClick={increaseQty}
                disabled={qty >= product?.stock}
              >
                <AddIcon />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Total Stok: {product?.stock}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography fontWeight="bold" fontSize={18}>
              Subtotal
            </Typography>
            <Typography fontWeight="bold" fontSize={20}>
              {`Rp ${parseFloat(subtotal).toLocaleString("id-ID")}`}
            </Typography>
          </Box>
        </Box>

        <Divider />

        {/* --- BAGIAN 2: ALAMAT PENGIRIMAN --- */}
        <Box>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Alamat Pengiriman
          </Typography>
          <SelectOptions
            provinces={provincesData || []}
            isProvincesLoading={isProvincesLoading}
            selectedProvinceValue={selectedProvince}
            onProvinceChange={handleProvinceChange}
            cities={citiesData || []}
            isCitiesLoading={isCitiesLoading}
            selectedCityValue={selectedCity}
            onCityChange={handleCityChange}
            districts={districtsData || []}
            isDistrictsLoading={isDistrictsLoading}
            selectedDistrictValue={selectedDistrict}
            onDistrictChange={handleDistrictChange}
            couriers={couriers}
            selectedCourierValue={selectedCourier}
            onCourierChange={handleCourierChange}
            services={services || []}
            isServicesLoading={isServicesLoading}
            selectedServiceValue={selectedService || ""}
            onServiceChange={handleServiceChange}
            addressValue={address}
            onAddressChange={setAddress}
          />
        </Box>

        <Divider />

        {/* --- BAGIAN 3: RINCIAN BIAYA --- */}
        <Box>
          <Stack spacing={1}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography fontWeight="500" color="text.secondary">
                Ongkir
              </Typography>
              <Typography fontWeight="500">
                Rp {shippingCost.toLocaleString("id-ID")}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography fontWeight="bold" fontSize={18}>
                Total
              </Typography>
              <Typography fontWeight="bold" fontSize={20} color="primary.main">
                Rp {parseFloat(total).toLocaleString("id-ID")}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* --- BAGIAN 4: TOMBOL AKSI --- */}
        <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
          <Button
            variant="outlined"
            onClick={cartHandler}
            fullWidth
            disabled={cartLoading}
          >
            {cartLoading ? "Menambahkan..." : "Keranjang"}
          </Button>
          <Button
            variant="contained"
            onClick={buyHandler}
            fullWidth
            disabled={isLoading || !selectedService}
          >
            {isLoading ? "Memproses..." : "Beli Sekarang"}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default Order;
