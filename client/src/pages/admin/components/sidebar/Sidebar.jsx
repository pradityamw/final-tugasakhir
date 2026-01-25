import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ListMenu from "./ListMenu";
import LogoutIcon from "@mui/icons-material/Logout";
import { blue } from "@mui/material/colors";
import { Link } from "react-router-dom";
import { logoutUser } from "../../../../state/api/authApi";
import { useDispatch } from "react-redux";

const Sidebar = () => {
  const dispatch = useDispatch();

  const logout = () => dispatch(logoutUser());
  return (
    <Box sx={{ width: 200, p: 1 }}>
      <List>
        {ListMenu.map((item, index) => (
          <ListItem key={index}>
            <ListItemButton component={Link} to={item.link}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider />
        <ListItem>
          <ListItemButton onClick={logout}>
            <ListItemIcon>
              <LogoutIcon sx={{ color: blue[800] }} />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
