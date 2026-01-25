import React, { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, updatePassword } from "../../../state/api/authApi";
import iziToast from "izitoast";
import CircularProgress from "@mui/material/CircularProgress";
import { passwordReset } from "../../../state/slice/UserSlice";

const SettingAdmin = () => {
  const dispatch = useDispatch();

  const {
    user,
    isUpdatePassword,
    isUpdatePasswordLoading,
    isUpdatePasswordError,
    message,
    error,
  } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const updateHandler = (e) => {
    e.preventDefault();

    const data = { username, oldPassword, newPassword };

    dispatch(updatePassword(data));
  };

  useEffect(() => {
    if (user) {
      setUsername(user?.username);
    }
  }, [user]);

  useEffect(() => {
    if (isUpdatePassword) {
      iziToast.success({
        title: "Success",
        message: message,
        position: "topRight",
        timeout: 3000,
      });
      dispatch(logoutUser());
      dispatch(passwordReset());
    }

    if (isUpdatePasswordError) {
      iziToast.error({
        title: "Error",
        message: error,
        position: "topRight",
        timeout: 3000,
      });
      dispatch(passwordReset());
    }
  }, [isUpdatePassword, isUpdatePasswordError, error]);
  return (
    <form className="form" onSubmit={updateHandler}>
      <TextField
        label="Username"
        value={username || ""}
        onChange={(e) => setUsername(e.target.value)}
      />

      <TextField
        label="Password Lama"
        type="password"
        value={oldPassword || ""}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <TextField
        label="Password Baru"
        type="password"
        value={newPassword || ""}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <Button variant="contained" color="success" type="submit">
        {isUpdatePasswordLoading ? <CircularProgress size={20} /> : "update"}
      </Button>
    </form>
  );
};

export default SettingAdmin;
