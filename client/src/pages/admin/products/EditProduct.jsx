import { Fragment, useEffect, useState } from "react";
import AdminBar from "../components/appbar/AdminBar";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
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

  const [previewImg, setPreviewImg] = useState([]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [capital, setCapital] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [weight, setWeight] = useState("");
  const [desc, setDesc] = useState("");
  const [newImages, setNewImages] = useState([]);
  const [inputKey, setInputKey] = useState(Date.now());

  const imgHandler = () => {
    document.getElementById("pickImg").click();
  };

  const uploadImg = (e) => {
    const files = Array.from(e.target.files);

    setNewImages(files);
    setInputKey(Date.now());
  };

  const dropImg = (e) => {
    e.preventDefault();

    const files = Array.from(e.dataTransfer.files);

    setNewImages(files);
    setInputKey(Date.now());
  };

  const dragImg = (e) => {
    e.preventDefault();
  };

  const removeImg = (index) => {
    setPreviewImg((prevImg) => {
      const updateImg = [...prevImg];
      updateImg.splice(index, 1);

      return updateImg;
    });
  };

  const removeNewImg = (index) => {
    setNewImages((prevImg) => {
      const updateImg = [...prevImg];
      updateImg.splice(index, 1);

      return updateImg;
    });
  };

  const editHandler = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("capital", capital);
    formData.append("stock", stock);
    formData.append("weight", weight);
    formData.append("desc", desc);

    newImages.forEach((file) => {
      formData.append("image", file);
    });

    previewImg.forEach((img) => {
      formData.append("image", img.link);
    });

    editProduct({ id: product._id, body: formData });
  };

  useEffect(() => {
    if (product) {
      setName(product?.name);
      setCategory(product?.category);
      setCapital(product?.capital);
      setPrice(product?.price);
      setStock(product?.stock);
      setWeight(product?.weight);
      setDesc(product?.desc);
      setPreviewImg(product?.image);
    }
  }, [product]);

  useEffect(() => {
    if (isSuccess) {
      iziToast.success({
        title: "Success",
        message: data?.message,
        position: "topRight",
        timeout: 3000,
      });

      reset();

      navigate("/admin-produk");
    }

    if (error) {
      iziToast.error({
        title: "Error",
        message: error?.data.message,
        position: "topRight",
        timeout: 3000,
      });

      reset();
    }
  }, [isSuccess, data, error]);

  return (
    <Fragment>
      <AdminBar />

      <Grid container sx={{ position: "relative", top: 70, minHeight: "80vh" }}>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            p: { xs: 1, md: 4 },
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <TextField
            label="Nama Produk"
            placeholder="Nama Produk"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Kategori"
            placeholder="Kategori"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <TextField
            label="Harga Jual"
            placeholder="Harga Jual"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <TextField
            label="Harga Beli"
            placeholder="Harga Beli"
            value={capital}
            onChange={(e) => setCapital(e.target.value)}
          />
          <TextField
            label="Stok"
            placeholder="Stok"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          <TextField
            label="Berat"
            placeholder="Berat (gram)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          sx={{
            p: { xs: 2, md: 4 },
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box sx={{ height: 300, mb: 2 }}>
            <ReactQuill
              theme="snow"
              value={desc}
              onChange={setDesc}
              style={{ width: "100%", height: "90%" }}
            />
          </Box>

          <Box
            sx={{
              p: 2,
              height: { xs: "auto", md: 300 },
              border: "2px dashed #ccc",
              "&:hover": { cursor: "pointer" },
            }}
            onDrop={dropImg}
            onDragOver={dragImg}
          >
            <Box
              sx={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              {newImages?.length > 0 ? (
                newImages.map((img, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(img)}
                    alt={`Preview ${index}`}
                    loading="lazy"
                    style={{ height: 140, width: 140, objectFit: "cover" }}
                    onClick={() => removeNewImg(index)}
                  />
                ))
              ) : previewImg?.length > 0 ? (
                previewImg.map((img, index) => (
                  <img
                    key={index}
                    src={img.link}
                    alt={`Preview ${index}`}
                    loading="lazy"
                    style={{ height: 140, width: 140, objectFit: "cover" }}
                    onClick={() => removeImg(index)}
                  />
                ))
              ) : (
                <Box
                  sx={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                  onClick={imgHandler}
                >
                  <CloudUploadIcon sx={{ fontSize: 80, color: "#ccc" }} />
                  <Typography>Drag & Drop</Typography>
                </Box>
              )}
            </Box>

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

          <Button variant="contained" color="primary" onClick={editHandler}>
            simpan
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default EditProduct;
