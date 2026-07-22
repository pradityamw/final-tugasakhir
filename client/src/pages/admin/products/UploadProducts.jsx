import { Box, Fade, IconButton, Input, Modal, Button, Typography } from "@mui/material";
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
    if (!file) return;

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

  const downloadTemplate = () => {
    // Kolom harus sesuai urutan yang dibaca server: name, category, capital, price, profit, stock, weight, desc
    const headers = [
      ["Nama Produk", "Kategori", "Harga Beli (Rp)", "Harga Jual (Rp)", "Profit (Rp)", "Stok", "Berat (gram)", "Deskripsi"],
      ["Contoh Produk", "Elektronik", 50000, 75000, 25000, 100, 500, "Deskripsi produk contoh"],
    ];

    const ws = XLSX.utils.aoa_to_sheet(headers);

    // Set lebar kolom agar lebih mudah dibaca
    ws["!cols"] = [
      { wch: 25 }, // Nama Produk
      { wch: 15 }, // Kategori
      { wch: 18 }, // Harga Beli
      { wch: 18 }, // Harga Jual
      { wch: 15 }, // Profit
      { wch: 8  }, // Stok
      { wch: 14 }, // Berat
      { wch: 35 }, // Deskripsi
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Produk");
    XLSX.writeFile(wb, "Template_Produk_Gudang_Hindu.xlsx");
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
      close();
    }

    if (error) {
      iziToast.error({
        title: "Error",
        message: error?.data?.message || "Something went wrong",
        position: "topRight",
        timeout: 3000,
      });

      reset();
    }
  }, [isSuccess, data, error, reset, close]);

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
            p: 4,
            borderRadius: "5px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box sx={{ position: "absolute", top: -16, right: -16 }}>
            <IconButton onClick={close} sx={{ bgcolor: "red", "&:hover": { bgcolor: "darkred" } }}>
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
          </Box>
          
          <Typography variant="h6">Upload Products</Typography>

          {isLoading ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Button variant="outlined" onClick={downloadTemplate} fullWidth>
                Download Excel Template
              </Button>
              <Input type="file" fullWidth required onChange={inputHandler} inputProps={{ accept: ".xlsx, .xls" }} />
            </>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default UploadProducts;
