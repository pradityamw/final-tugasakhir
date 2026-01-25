import AdminBar from "../components/appbar/AdminBar";
import { Box, Input } from "@mui/material";
import UsersTable from "./UsersTable";
import { useGetUsersQuery } from "../../../state/api/userApi";
import { Fragment, useState } from "react";
import Protect from "../Protect";
import Title from "../../../components/title/Title";

const UsersPage = () => {
  Protect();

  const { data: users } = useGetUsersQuery();

  const [searchTerm, setSearchTerm] = useState("");

  const searchFunction = (e) => setSearchTerm(e.target.value);

  const filtered = (user) => {
    return user.name.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const filteredUsers = users?.filter(filtered);

  return (
    <Fragment>
      <Title title={"Toserba | Admin Pelanggan"} />
      <AdminBar />

      {/* SEARCH FUNCTION */}

      <Box sx={{ position: "relative", top: 70 }}>
        <Box sx={{ p: 2 }}>
          <Input
            placeholder="Cari Pelanggan"
            sx={{ p: 1 }}
            value={searchTerm}
            onChange={searchFunction}
          />
        </Box>

        <Box sx={{ p: 2 }}>
          <UsersTable users={filteredUsers} />
        </Box>
      </Box>
    </Fragment>
  );
};

export default UsersPage;
