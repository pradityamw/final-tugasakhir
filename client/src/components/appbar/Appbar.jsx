import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import LoginIcon from "@mui/icons-material/Login";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../state/api/authApi";
import iziToast from "izitoast";
import { authReset } from "../../state/slice/UserSlice";
import { useMyCartQuery } from "../../state/api/cartApi";
import { useGetStoreDataQuery } from "../../state/api/storeApi";

const Appbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data } = useMyCartQuery();
  const { data: store } = useGetStoreDataQuery();

  const { user, isLogout, message } = useSelector((state) => state.auth);

  const userMenu = [
    {
      menu: "Home",
      link: "/",
    },
    {
      menu: "Profile",
      link: "/profile",
    },
    {
      menu: "Order",
      link: "/order",
    },
  ];
  const adminMenu = [
    { menu: "Setting", link: "/admin-setting" },
    { menu: "Dashboard", link: "/admin-dashboard" },
  ];

  const [open, setOpen] = useState(null);

  const menuOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const menuClose = (event) => {
    setOpen(null);
  };

  const toCart = () => navigate("/cart");

  const toHome = () => navigate("/");

  const toLoginPage = () => navigate("/login");

  const toPage = (link) => {
    navigate(link);
    menuClose();
  };

  const logout = () => dispatch(logoutUser());

  useEffect(() => {
    if (isLogout) {
      iziToast.success({
        title: "Success",
        message: message,
        position: "topRight",
        timeout: 3000,
      });

      localStorage.removeItem("login");

      dispatch(authReset());

      navigate("/");
    }
  }, [isLogout, message]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ cursor: "pointer" }} onClick={toHome}>
            <img
              src="/logo2.png"
              alt="logo"
              style={{ height: "50px", width: "120px", objectFit: "contain" }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            {user?.role === "user" ? (
              <>
                <IconButton color="inherit" onClick={toCart}>
                  <Badge badgeContent={data?.products.length} color="error">
                    <ShoppingCartOutlinedIcon />
                  </Badge>
                </IconButton>

                <IconButton color="inherit" onClick={menuOpen}>
                  <AccountCircleIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={open}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(open)}
                  onClose={menuClose}
                >
                  {userMenu.map((item, index) => (
                    <MenuItem key={index} onClick={() => toPage(item.link)}>
                      {item.menu}
                    </MenuItem>
                  ))}

                  <MenuItem onClick={() => logout()}>Logout</MenuItem>
                </Menu>
              </>
            ) : user?.role === "admin" ? (
              <>
                <IconButton color="inherit" onClick={menuOpen}>
                  <AccountCircleIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={open}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(open)}
                  onClose={menuClose}
                >
                  {adminMenu.map((item, index) => (
                    <MenuItem key={index} onClick={() => toPage(item.link)}>
                      {item.menu}
                    </MenuItem>
                  ))}

                  <MenuItem onClick={() => logout()}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <IconButton color="inherit" onClick={toLoginPage}>
                <LoginIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Appbar;
