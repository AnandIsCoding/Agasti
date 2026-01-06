import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import { createProduct } from "../../api/api";

export default function AdminCreateProduct() {
  const [loading, setLoading] = useState(false);
  const { categories } = useSelector((state) => state.categories);

  const [product, setProduct] = useState({
    name: "",
    categoryId: "",
    price: "",
    offerPrice: "",
    rating: "",
    inStock: true,
    isFeatured: false,
    images: [null, null, null, null],
    longDescription: "",
    dimension: "",
    weight: "",
    sustainability: "",
    installation: "",
    details: "",
    shippingReturns: "",
  });

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (index, file) => {
    if (!file) return;
    const updated = [...product.images];
    updated[index] = file;
    setProduct((prev) => ({ ...prev, images: updated }));
  };

  const removeImage = (index) => {
    const updated = [...product.images];
    updated[index] = null;
    setProduct((prev) => ({ ...prev, images: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.name || !product.categoryId || !product.price) {
      toast.error("Name, Category & Price are required");
      return;
    }

    if (!product.images.some(Boolean)) {
      toast.error("At least one product image is required");
      return;
    }

    try {
      const formData = new FormData();

      Object.entries(product).forEach(([key, value]) => {
        if (key === "images") {
          value.forEach((img) => img && formData.append("images", img));
        } else {
          formData.append(key, value);
        }
      });

      await createProduct(formData);

      // RESET FORM
      setProduct({
        name: "",
        categoryId: "",
        price: "",
        offerPrice: "",
        rating: "",
        inStock: true,
        isFeatured: false,
        images: [null, null, null, null],
        longDescription: "",
        dimension: "",
        weight: "",
        sustainability: "",
        installation: "",
        details: "",
        shippingReturns: "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <Box sx={{ p: 4, bgcolor: "#f9fafb", minHeight: "100vh" }}>
      <Paper sx={{ maxWidth: 1100, mx: "auto", p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          Create Product
        </Typography>

        <form onSubmit={handleSubmit}>
          <Section title="Basic Information" />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Product Name"
                name="name"
                fullWidth
                required
                value={product.name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Category"
                name="categoryId"
                fullWidth
                required
                value={product.categoryId}
                onChange={handleChange}
              >
                {categories?.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Price (₹)"
                name="price"
                type="number"
                fullWidth
                required
                value={product.price}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Offer Price (₹)"
                name="offerPrice"
                type="number"
                fullWidth
                value={product.offerPrice}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Rating"
                name="rating"
                type="number"
                inputProps={{ min: 0, max: 5 }}
                fullWidth
                value={product.rating}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box display="flex" gap={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={product.inStock}
                      onChange={(e) =>
                        setProduct((p) => ({
                          ...p,
                          inStock: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="In Stock"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={product.isFeatured}
                      onChange={(e) =>
                        setProduct((p) => ({
                          ...p,
                          isFeatured: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Featured"
                />
              </Box>
            </Grid>
          </Grid>

          <Section title="Product Images" />

          <Grid container spacing={3}>
            {product.images.map((img, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box
                  sx={{
                    height: 180,
                    border: "2px dashed #cbd5e1",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {img ? (
                    <>
                      <img
                        src={URL.createObjectURL(img)}
                        alt="preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <IconButton
                        onClick={() => removeImage(index)}
                        sx={{
                          position: "absolute",
                          top: 6,
                          right: 6,
                          bgcolor: "black",
                        }}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton component="label">
                      <CloudUploadOutlinedIcon fontSize="large" />
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageUpload(index, e.target.files[0])
                        }
                      />
                    </IconButton>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>

          <Section title="Product Details" />

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Long Description"
                name="longDescription"
                multiline
                rows={4}
                fullWidth
                value={product.longDescription}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Dimensions"
                name="dimension"
                fullWidth
                value={product.dimension}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Weight"
                name="weight"
                fullWidth
                value={product.weight}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Sustainability"
                name="sustainability"
                multiline
                rows={2}
                fullWidth
                value={product.sustainability}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Installation Instructions"
                name="installation"
                multiline
                rows={2}
                fullWidth
                value={product.installation}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Additional Details"
                name="details"
                multiline
                rows={2}
                fullWidth
                value={product.details}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Shipping & Returns"
                name="shippingReturns"
                multiline
                rows={2}
                fullWidth
                value={product.shippingReturns}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Box mt={4}>
            <Button
              type="submit"
              disabled={loading}
              sx={{
                width: "100%",
                py: 1.5,
                bgcolor: "black",
                color: "white",
                fontWeight: 600,
              }}
            >
              {loading ? "Creating Product..." : "Create Product"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

/* ---------- SECTION HEADER ---------- */
function Section({ title }) {
  return (
    <>
      <Typography fontWeight={600} mt={5} mb={1}>
        {title}
      </Typography>
      <Divider sx={{ mb: 3 }} />
    </>
  );
}
