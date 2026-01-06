import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { deleteProduct, getAllProducts, updateProduct } from "../../api/api";

export default function AdminAllProducts() {
  const [products, setProducts] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");

  /* ---------------- FETCH PRODUCTS ---------------- */
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
      setRows(data);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FILTER & SORT ---------------- */
  useEffect(() => {
    let data = [...products];

    if (search) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (sortBy === "price-asc") data.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") data.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") data.sort((a, b) => b.rating - a.rating);

    setRows(data);
    setPage(0);
  }, [search, sortBy, products]);

  /* ---------------- MODALS ---------------- */
  const openEditModal = (row) => {
    setSelectedProduct({
      ...row,
      images: Array.from({ length: 4 }).map((_, i) => ({
        file: null,
        preview: row.images?.[i] || "",
        isNew: false,
      })),
    });
    setOpenEdit(true);
  };

  const openDeleteModal = (row) => {
    setSelectedProduct(row);
    setOpenDelete(true);
  };

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct((p) => ({ ...p, [name]: value }));
  };

  const handleImageChange = (index, file) => {
    if (!file) return;

    setSelectedProduct((p) => {
      const images = [...p.images];
      images[index] = {
        file,
        preview: URL.createObjectURL(file),
        isNew: true,
      };
      return { ...p, images };
    });
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      Object.entries(selectedProduct).forEach(([key, value]) => {
        if (key === "images") {
          value.forEach((img) => {
            if (img.isNew && img.file) {
              formData.append("images", img.file);
            }
          });
        } else if (key !== "_id" && key !== "category") {
          formData.append(key, value ?? "");
        }
      });

      await updateProduct(selectedProduct._id, formData);
      setOpenEdit(false);
      fetchProducts();
    } catch {
      // handled in api.js
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct?._id) return;

    try {
      await deleteProduct(selectedProduct._id);
      setOpenDelete(false);
      setSelectedProduct(null);
      fetchProducts(); // refresh table
    } catch {
      // toast already handled in api.js
    }
  };

  const paginatedRows = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  /* ---------------- UI ---------------- */
  return (
    <>
      <Paper sx={{ width: "100%", borderRadius: 2 }}>
        <Box p={2} display="flex" gap={2} alignItems="center">
          <Typography variant="h6" fontWeight={700}>
            Products List
          </Typography>

          <TextField
            size="small"
            placeholder="Search product"
            onChange={(e) => setSearch(e.target.value)}
          />

          <TextField
            size="small"
            select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            sx={{ width: 180 }}
          >
            <MenuItem value="">Sort</MenuItem>
            <MenuItem value="price-asc">Price ↑</MenuItem>
            <MenuItem value="price-desc">Price ↓</MenuItem>
            <MenuItem value="rating">Rating</MenuItem>
          </TextField>
        </Box>

        <TableContainer sx={{ overflowX: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Featured</TableCell>
                <TableCell>Sold</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Offer Price</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>
                    <Avatar src={row.images?.[0]} variant="rounded" />
                  </TableCell>
                  <TableCell>{row._id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.category?.name}</TableCell>

                  <TableCell>
                    <Chip
                      label={row.inStock ? "In Stock" : "Out"}
                      color={row.inStock ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={row.isFeatured ? "Featured" : "Normal"}
                      color={row.isFeatured ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>{row.sold || 0}</TableCell>
                  <TableCell>₹{row.price}</TableCell>
                  <TableCell>₹{row.offerPrice}</TableCell>
                  <TableCell>{row.rating}</TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton onClick={() => openEditModal(row)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => openDeleteModal(row)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(+e.target.value);
            setPage(0);
          }}
        />
      </Paper>

      {/* ---------------- EDIT MODAL ---------------- */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Update Product</DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2}>
            {selectedProduct?.images?.map((img, i) => (
              <Grid item xs={6} md={3} key={i}>
                <Box
                  sx={{
                    border: "2px dashed",
                    borderColor: img.preview ? "transparent" : "#ccc",
                    borderRadius: 2,
                    height: 150,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    bgcolor: "#fafafa",
                    overflow: "hidden",
                  }}
                >
                  {img.preview ? (
                    <img
                      src={img.preview}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Stack
                      alignItems="center"
                      spacing={1}
                      sx={{ opacity: 0.6 }}
                    >
                      <CloudUploadIcon />
                      <Typography variant="caption">Add Image</Typography>
                    </Stack>
                  )}

                  <IconButton
                    component="label"
                    sx={{
                      position: "absolute",
                      bottom: 6,
                      right: 6,
                      bgcolor: "white",
                      boxShadow: 1,
                    }}
                  >
                    <CloudUploadIcon fontSize="small" />
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(i, e.target.files[0])}
                    />
                  </IconButton>
                </Box>
              </Grid>
            ))}

            {[
              "name",
              "price",
              "offerPrice",
              "rating",
              "dimension",
              "weight",
              "longDescription",
              "sustainability",
              "installation",
              "details",
              "shippingReturns",
            ].map((field) => (
              <Grid item xs={12} md={field.length > 12 ? 12 : 6} key={field}>
                <TextField
                  label={field}
                  name={field}
                  value={selectedProduct?.[field] || ""}
                  onChange={handleChange}
                  fullWidth
                  multiline={field.length > 12}
                  rows={field.length > 12 ? 3 : 1}
                />
              </Grid>
            ))}

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedProduct?.isFeatured || false}
                    onChange={(e) =>
                      setSelectedProduct((p) => ({
                        ...p,
                        isFeatured: e.target.checked,
                      }))
                    }
                  />
                }
                label="Featured"
              />
              <FormControlLabel
                sx={{ ml: 4 }}
                control={
                  <Switch
                    checked={selectedProduct?.inStock || false}
                    onChange={(e) =>
                      setSelectedProduct((p) => ({
                        ...p,
                        inStock: e.target.checked,
                      }))
                    }
                  />
                }
                label="In Stock"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* ---------------- DELETE MODAL ---------------- */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete Product</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <b>{selectedProduct?.name}</b>?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
