import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const config = {
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
};

const configImg = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
};

export const loginUser = createAsyncThunk(
  "user/login",
  async (userData, thunkApi) => {
    try {
      const { data } = await axios.post("/user/login", userData, config);

      return data.user;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data.message);
    }
  }
);

export const register = createAsyncThunk(
  "user/register",
  async (userData, thunkApi) => {
    try {
      const { data } = await axios.post("/user/register", userData, config);

      return data.message;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData, thunkApi) => {
    try {
      const { data } = await axios.put(
        "/user/update-profile",
        userData,
        config
      );

      return data.message;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data.error);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (userData, thunkApi) => {
    try {
      const { data } = await axios.put(
        "/user/change-password",
        userData,
        config
      );

      return data.message;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data.message);
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  "/user/uploadAvatar",
  async (file, thunkApi) => {
    try {
      const avatar = new FormData();
      avatar.append("file", file);

      const { data } = await axios.post(
        "/user/upload-avatar",
        avatar,
        configImg
      );

      return data.message;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data.message);
    }
  }
);

export const loadUser = createAsyncThunk(
  "/user/loadUser",
  async (_, thunkApi) => {
    try {
      const { data } = await axios.get("/user/profile", config);

      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "/user/logout",
  async (_, thunkApi) => {
    try {
      const { data } = await axios.post("/user/logout", config);

      return data.message;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data.message);
    }
  }
);
