import { Box, Fade, IconButton, Input, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import * as XLSX from "xlsx";
import { useUploadProductsMutation } from "../../../state/api/productApi";
import { useEffect } from "react";
import iziToast from "izitoast";
import CircularProgress from "@mui/material/CircularProgress";

const UploadProducts = ({ open, close }) => {
  const [uploadProducts, { data, isSuccess, isLoading, error, reset }] =
    useUploadProductsMutation();

  const inputHandler = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        range: 1,
      });

      const result = { data: jsonData };

      uploadProducts(result);
    };

    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    if (isSuccess) {
      iziToast.success({
        title: "Success",
        message: data?.message,
        position: "topRight",
        timeout: 3000,
      });

      reset();

      close;
    }

    if (error) {
      iziToast.success({
        title: "Success",
        message: error?.data.message,
        position: "topRight",
        timeout: 3000,
      });

      reset();

      console.log(error);
    }
  }, [isSuccess, data, error]);

  return (
    <Modal open={open} onClose={close}>
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "white",
            boxShadow: 24,
            p: 2,
            borderRadius: "5px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box sx={{ position: "absolute", top: -16, right: -16 }}>
            <IconButton onClick={close} sx={{ bgcolor: "red" }}>
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
          </Box>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Input type="file" fullWidth required onChange={inputHandler} />
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default UploadProducts;
