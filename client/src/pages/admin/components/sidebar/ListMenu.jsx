import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ChatIcon from "@mui/icons-material/Chat";
import { blue } from "@mui/material/colors";

const ListMenu = [
  {
    label: "Dashboard",
    link: "/admin-dashboard",
    icon: <DashboardIcon sx={{ color: blue[800] }} />,
  },
  {
    label: "Pelanggan",
    link: "/admin-pelanggan",
    icon: <PeopleAltIcon sx={{ color: blue[800] }} />,
  },
  {
    label: "Produk",
    link: "/admin-produk",
    icon: <LocalMallIcon sx={{ color: blue[800] }} />,
  },
  {
    label: "Pesanan",
    link: "/admin-pesanan",
    icon: <ShoppingCartIcon sx={{ color: blue[800] }} />,
  },
  {
    label: "Laporan",
    link: "/admin-laporan",
    icon: <AssessmentIcon sx={{ color: blue[800] }} />,
  },
  {
    label: "Pesan",
    link: "/admin-pesan",
    icon: <ChatIcon sx={{ color: blue[800] }} />,
  },
];

export default ListMenu;
