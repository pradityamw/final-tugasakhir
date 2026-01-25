import {
  Avatar,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useDeleteUserMutation } from "../../../state/api/userApi";
import { useEffect } from "react";
import iziToast from "izitoast";

const columns = [
  {
    id: 1,
    label: "No",
    width: 30,
  },
  {
    id: 4,
    label: "Nama",
    width: 120,
  },
  {
    id: 5,
    label: "Email",
    width: 120,
  },
  {
    id: 6,
    label: "No HP",
    width: 120,
  },
  {
    id: 7,
    label: "Aksi",
    width: 100,
  },
];

const UsersTable = ({ users }) => {
  const [deleteUser, { data, isSuccess, isLoading, error, reset }] =
    useDeleteUserMutation();

  const deleteHandler = (id) => deleteUser(id);

  useEffect(() => {
    if (isSuccess) {
      iziToast.success({
        title: "Success",
        message: data?.message,
        position: "topRight",
        timeout: 3000,
      });

      reset();
    }

    if (error) {
      iziToast.success({
        title: "Success",
        message: error?.data.message,
        position: "topRight",
        timeout: 3000,
      });

      console.log(error);

      reset();
    }
  }, [isSuccess, data, error]);
  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  align="center"
                  key={column.id}
                  sx={{ minWidth: column.width }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((user, index) => (
              <TableRow key={index}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell
                  sx={{
                    display: "flex",
                    verticalAlign: "center",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Avatar alt={user.name} src={user.avatar} /> {user.name}
                </TableCell>
                <TableCell align="center">{user.username}</TableCell>
                <TableCell align="center">{user.phone}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteOutlineOutlinedIcon />}
                    onClick={() => deleteHandler(user._id)}
                  >
                    {isLoading ? "..." : "Hapus"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default UsersTable;
