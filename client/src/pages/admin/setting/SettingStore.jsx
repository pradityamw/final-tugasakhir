import React, { useEffect, useState } from "react";
import {
  useGetCitiesQuery,
  useGetProvincesQuery,
} from "../../../state/api/shipmentApi";
import "./styles.css";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useUpdateStoreMutation } from "../../../state/api/storeApi";
import iziToast from "izitoast";
import CircularProgress from "@mui/material/CircularProgress";

const SettingStore = ({ store }) => {
  const [name, setName] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const [oldLogo, setOldLogo] = useState(null);
  const [newLogo, setNewLogo] = useState(null);

  const [oldSliders, setOldSliders] = useState([]);
  const [newSliders, setNewSliders] = useState([]);

  const { data: provinces } = useGetProvincesQuery();
  const { data: cities } = useGetCitiesQuery(province, { skip: !province });
  const [updateStore, { data, isLoading, isSuccess, error, reset }] =
    useUpdateStoreMutation();

  const logoClick = () => {
    document.getElementById("logo").click();
  };

  const inputLogo = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        setOldLogo(reader.result);
      };

      reader.readAsDataURL(file);
    }

    setNewLogo(file);
  };

  const sliderClick = () => {
    document.getElementById("slider").click();
  };

  const inputSlider = (e) => {
    const files = Array.from(e.target.files);

    setOldSliders((previmg) => [
      ...previmg,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);

    setNewSliders((prevFile) => [...prevFile, ...files]);
  };

  const removeSlider = (index) => {
    setOldSliders((previmg) => {
      const updateImg = [...previmg];
      updateImg.splice(index, 1);
      return updateImg;
    });

    setNewSliders((previmg) => {
      const updateImg = [...previmg];
      updateImg.splice(index, 1);
      return updateImg;
    });
  };

  const updateHandler = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", name);
    data.append("province", province);
    data.append("city", city);
    data.append("address", address);
    data.append("logo", newLogo ? newLogo : oldLogo);
    const sliders = newSliders ? newSliders : oldSliders;

    if (sliders) {
      sliders.forEach((file) => {
        data.append("sliders", file);
      });
    }

    updateStore(data);
  };

  useEffect(() => {
    if (isSuccess) {
      iziToast.success({
        title: "Success",
        message: data.message,
        position: "topRight",
        timeout: 3000,
      });

      reset();
    }

    if (error) {
      iziToast.error({
        title: "Error",
        message: error.data.message,
        position: "topRight",
        timeout: 3000,
      });

      reset();
    }
  }, [isSuccess, data, error]);

  useEffect(() => {
    if (store) {
      setName(store?.name);
      setProvince(store?.province);
      setCity(store?.city);
      setAddress(store?.address);
      setOldLogo(store?.logo);
      setOldSliders(store?.sliders.map((slider) => slider.link));
    }
  }, [store]);

  return (
    <form className="form" onSubmit={updateHandler}>
      <TextField
        label="Nama Toko"
        value={name || ""}
        onChange={(e) => setName(e.target.value)}
      />

      <FormControl fullWidth>
        <InputLabel>Provinsi</InputLabel>
        <Select
          label="Provinsi"
          value={province || ""}
          onChange={(e) => setProvince(e.target.value)}
        >
          {provinces?.map((item) => (
            <MenuItem key={item.province_id} value={item.province_id}>
              {item.province}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Kota / Kabupatan</InputLabel>
        <Select
          label="Kota / Kabupatan"
          value={city || ""}
          onChange={(e) => setCity(e.target.value)}
        >
          {cities?.map((item) => (
            <MenuItem key={item.city_id} value={item.city_id}>
              {item.city_type} {item.city_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <textarea
        className="text"
        value={address || ""}
        onChange={(e) => setAddress(e.target.value)}
      />
      <Grid container gap={2}>
        {/* Logo */}
        <Grid
          item
          xs={12}
          md={12}
          sx={{ p: 2, bgcolor: "#ccc", "&:hover": { cursor: "pointer" } }}
          onClick={logoClick}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img
              src={oldLogo ? oldLogo : newLogo}
              alt="logo"
              style={{ height: "100px", width: "200px", objectFit: "contain" }}
            />
          </Box>

          <input
            type="file"
            id="logo"
            style={{ display: "none" }}
            onChange={inputLogo}
          />
        </Grid>

        {/* Slider */}
        <Grid
          item
          xs={12}
          md={12}
          sx={{ p: 2, bgcolor: "#ccc", "&:hover": { cursor: "pointer" } }}
        >
          {oldSliders?.length > 0 ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {oldSliders?.map((img, index) => (
                <Box
                  key={index}
                  sx={{ position: "relative", display: "inline-block" }}
                  onClick={() => removeSlider(index)}
                >
                  <img
                    src={img}
                    alt={`Slider - ${index}`}
                    style={{
                      height: "100px",
                      width: "150px",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": { cursor: "pointer" },
              }}
              onClick={sliderClick}
            >
              <Typography>Upload here</Typography>
            </Box>
          )}
          <input
            type="file"
            multiple
            id="slider"
            style={{ display: "none" }}
            onChange={inputSlider}
          />
        </Grid>
      </Grid>

      <Button variant="contained" color="success" type="submit">
        {isLoading ? <CircularProgress size={20} /> : "update"}
      </Button>
    </form>
  );
};

export default SettingStore;
