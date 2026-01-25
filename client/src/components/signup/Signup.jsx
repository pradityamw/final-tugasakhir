import { Box, Button, TextField, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import Title from "../../components/title/Title";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser, register } from "../../state/api/authApi";
import { useNavigate } from "react-router-dom";
import iziToast from "izitoast";
import CircularProgress from "@mui/material/CircularProgress";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    isRegister,
    isRegisterLoading,
    isRegisterError,
    message,
    error,
    user,
  } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    const data = {
      name,
      username,
      phone,
      password,
    };

    dispatch(register(data));
  };

  useEffect(() => {
    if (isRegister) {
      localStorage.setItem("login", JSON.stringify("login"));

      navigate("/");

      window.location.reload();
    }

    if (isRegisterError) {
      iziToast.error({
        title: "Error",
        message: error,
        position: "topRight",
        timeout: 3000,
      });
    }
  }, [isRegister, isRegisterError, error, message, user]);

  const googleLogin = () => {
    location.href = `${import.meta.env.VITE_BASE_URL}/auth/google/ecommerce`;

    localStorage.setItem("login", JSON.stringify("login"));
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Title title={"Daftar"} />

      <Box
        sx={{
          width: 1000,
          height: 550,
          display: "flex",
          borderRadius: "5px",
          boxShadow: 4,
        }}
      >
        <Box sx={{ flex: 1, p: 4, display: { xs: "none", md: "flex" } }}>
          <img
            src="https://img.freepik.com/free-vector/seasonal-sale-discounts-presents-purchase-visiting-boutiques-luxury-shopping-price-reduction-promotional-coupons-special-holiday-offers-vector-isolated-concept-metaphor-illustration_335657-2766.jpg"
            alt="daftar"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            p: 4,
            gap: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Daftar
          </Typography>
          <Typography variant="body2">
            * Kami menjaga data anda, No Handphone digunakan untuk
            mengkonfirmasi pengiriman barang
          </Typography>

          {isRegisterLoading ? (
            <Box
              sx={{
                display: "flex",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <form
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
              onSubmit={submitHandler}
            >
              <TextField
                fullWidth
                placeholder="Nama"
                label="Nama"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <TextField
                fullWidth
                placeholder="Email"
                label="Email"
                name="email"
                type="email"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <TextField
                fullWidth
                placeholder="No HP"
                label="No HP"
                name="phone"
                type="number"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <TextField
                fullWidth
                placeholder="Password"
                label="Password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button variant="contained" color="success" type="submit">
                daftar
              </Button>

              <Typography align="center">Atau Login dengan</Typography>

              <Button
                variant="contained"
                color="error"
                startIcon={<GoogleIcon />}
                onClick={googleLogin}
              >
                Google
              </Button>
            </form>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;
