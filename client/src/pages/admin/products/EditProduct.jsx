import { Fragment, useEffect, useState } from "react";
import NgrokImage from "../../../components/NgrokImage";
import AdminBar from "../components/appbar/AdminBar";
import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReactQuill from "react-quill";
import iziToast from "izitoast";
import { useNavigate, useParams } from "react-router-dom";
import {
  useEditProductMutation,
  useGetProductQuery,
} from "../../../state/api/productApi";

const EditProduct = () => {
  const params = useParams();

  const { data: product } = useGetProductQuery(params?.name);
  const [editProduct, { data, isSuccess, error, isLoading, reset }] =
    useEditProductMutation();

  const navigate = useNavigate();

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [inputKey, setInputKey] = useState(Date.now());

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [capital, setCapital] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [weight, setWeight] = useState("");
  const [desc, setDesc] = useState("");

  const triggerFileInput = () => {
    const el = document.getElementById("pickImg");
    if (el) el.click();
  };

  const uploadImg = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setNewImages((prev) => [...prev, ...files]);
      setInputKey(Date.now());
    }
  };

  const dropImg = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setNewImages((prev) => [...prev, ...files]);
      setInputKey(Date.now());
    }
  };

  const dragImg = (e) => {
    e.preventDefault();
  };

  const removeExistingImg = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImg = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeAllImages = () => {
    setExistingImages([]);
    setNewImages([]);
  };

  const editHandler = () => {
    if (!name.trim()) {
      return iziToast.error({
        title: "Error",
        message: "Nama produk tidak boleh kosong",
        position: "topRight",
      });
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("capital", capital);
    formData.append("stock", stock);
    formData.append("weight", weight);
    formData.append("desc", desc);

    // Kirim file-file baru
    newImages.forEach((file) => {
      formData.append("image", file);
    });

    // Kirim URL gambar-gambar lama yang dipertahankan
    existingImages.forEach((img) => {
      const link = typeof img === "string" ? img : img.link;
      if (link) {
        formData.append("image", link);
      }
    });

    editProduct({ id: product._id, body: formData });
  };

  useEffect(() => {
    if (product) {
      setName(product?.name || "");
      setCategory(product?.category || "");
      setCapital(product?.capital !== undefined ? String(product?.capital) : "");
      setPrice(product?.price !== undefined ? String(product?.price) : "");
      setStock(product?.stock !== undefined ? String(product?.stock) : "");
      setWeight(product?.weight !== undefined ? String(product?.weight) : "");
      setDesc(product?.desc || "");
      setExistingImages(product?.image || []);
      setNewImages([]);
    }
  }, [product]);

  useEffect(() => {
    if (isSuccess) {
      iziToast.success({
        title: "Success",
        message: data?.message || "Produk berhasil diperbarui",
        position: "topRight",
        timeout: 3000,
      });

      reset();
      navigate("/admin-produk");
    }

    if (error) {
      iziToast.error({
        title: "Error",
        message: error?.data?.message || "Gagal memperbarui produk",
        position: "topRight",
        timeout: 3000,
      });

      reset();
    }
  }, [isSuccess, data, error, reset, navigate]);

  const hasAnyImages = existingImages.length > 0 || newImages.length > 0;

  return (
    <Fragment>
      <AdminBar />

      <Grid container sx={{ position: "relative", top: 70, minHeight: "80vh", pb: 6 }}>
        <Grid item xs={12} sx={{ px: { xs: 2, md: 4 }, pt: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            variant="text"
            sx={{ textTransform: "none" }}
          >
            Kembali
          </Button>
        </Grid>

        {/* Form Inputs Kolom Kiri */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            p: { xs: 2, md: 4 },
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Edit Informasi Produk
          </Typography>
          <TextField
            label="Nama Produk"
            placeholder="Nama Produk"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Kategori"
            placeholder="Kategori"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
          />
          <TextField
            label="Harga Jual (Rp)"
            placeholder="Harga Jual"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
          />
          <TextField
            label="Harga Beli / Modal (Rp)"
            placeholder="Harga Beli"
            type="number"
            value={capital}
            onChange={(e) => setCapital(e.target.value)}
            fullWidth
          />
          <TextField
            label="Stok"
            placeholder="Stok"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            fullWidth
          />
          <TextField
            label="Berat (gram)"
            placeholder="Berat"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            fullWidth
          />
        </Grid>

        {/* Kolom Kanan: Deskripsi & Gambar */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            p: { xs: 2, md: 4 },
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              Deskripsi Produk
            </Typography>
            <Box sx={{ height: 220, mb: 4 }}>
              <ReactQuill
                theme="snow"
                value={desc}
                onChange={setDesc}
                style={{ width: "100%", height: "100%" }}
              />
            </Box>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1.5,
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold">
                Gambar Produk
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<AddPhotoAlternateIcon />}
                  onClick={triggerFileInput}
                  sx={{ textTransform: "none" }}
                >
                  + Tambah / Ganti Gambar
                </Button>
                {hasAnyImages && (
                  <Button
                    size="small"
                    variant="text"
                    color="error"
                    onClick={removeAllImages}
                    sx={{ textTransform: "none" }}
                  >
                    Hapus Semua
                  </Button>
                )}
              </Box>
            </Box>

            <Box
              sx={{
                p: 2,
                minHeight: 180,
                border: "2px dashed #90caf9",
                borderRadius: 2,
                bgcolor: "#f8fafd",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
              onDrop={dropImg}
              onDragOver={dragImg}
            >
              {hasAnyImages ? (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  {/* Gambar Lama */}
                  {existingImages.map((img, index) => (
                    <Box
                      key={`existing-${index}`}
                      sx={{
                        position: "relative",
                        width: 120,
                        height: 120,
                        borderRadius: 1,
                        overflow: "hidden",
                        border: "1px solid #e0e0e0",
                        bgcolor: "white",
                        boxShadow: 1,
                      }}
                    >
                      <NgrokImage
                        src={typeof img === "string" ? img : img.link}
                        alt={`Produk ${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <Chip
                        label="Lama"
                        size="small"
                        sx={{
                          position: "absolute",
                          bottom: 4,
                          left: 4,
                          fontSize: 10,
                          height: 18,
                          bgcolor: "rgba(0,0,0,0.6)",
                          color: "white",
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeExistingImg(index)}
                        sx={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                          bgcolor: "rgba(255, 255, 255, 0.9)",
                          color: "error.main",
                          p: 0.5,
                          "&:hover": { bgcolor: "error.main", color: "white" },
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  ))}

                  {/* Gambar Baru yang Dipilih */}
                  {newImages.map((file, index) => (
                    <Box
                      key={`new-${index}`}
                      sx={{
                        position: "relative",
                        width: 120,
                        height: 120,
                        borderRadius: 1,
                        overflow: "hidden",
                        border: "2px solid #4caf50",
                        bgcolor: "white",
                        boxShadow: 2,
                      }}
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New ${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <Chip
                        label="Baru"
                        color="success"
                        size="small"
                        sx={{
                          position: "absolute",
                          bottom: 4,
                          left: 4,
                          fontSize: 10,
                          height: 18,
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeNewImg(index)}
                        sx={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                          bgcolor: "rgba(255, 255, 255, 0.9)",
                          color: "error.main",
                          p: 0.5,
                          "&:hover": { bgcolor: "error.main", color: "white" },
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    py: 4,
                    cursor: "pointer",
                  }}
                  onClick={triggerFileInput}
                >
                  <CloudUploadIcon sx={{ fontSize: 60, color: "#90caf9", mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Klik atau Drag & Drop gambar ke sini untuk mengunggah
                  </Typography>
                </Box>
              )}

              <input
                type="file"
                key={inputKey}
                multiple
                id="pickImg"
                accept="image/*"
                style={{ display: "none" }}
                onChange={uploadImg}
              />
            </Box>
          </Box>

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={editHandler}
            disabled={isLoading}
            sx={{ mt: 2, py: 1.2, fontWeight: "bold" }}
          >
            {isLoading ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default EditProduct;
