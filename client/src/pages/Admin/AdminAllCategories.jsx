import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  deleteCategoryById,
  getAllCategory,
  updateCategory,
} from "../../api/api";

export default function AdminCategories() {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.categories);

  /* ------------------ HANDLERS ------------------ */

  const handleEditOpen = (category) => {
    setSelectedCategory({
      ...category,
      imageFile: null,
      imagePreview: null,
    });
    setEditOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (file) => {
    if (!file) return;

    setSelectedCategory((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const handleUpdateCategory = async () => {
    try {
      if (!selectedCategory) return;

      const formData = new FormData();
      formData.append("name", selectedCategory.name);

      if (selectedCategory.imageFile) {
        formData.append("image", selectedCategory.imageFile);
      }

      await updateCategory(dispatch, selectedCategory._id, formData);

      setEditOpen(false);
      getAllCategory(dispatch);
    } catch (error) {
      console.error("❌ Error in updating category -->> ", error);
    }
  };

  /* ------------------ DELETE HANDLER ------------------ */
  const handleDeleteCategory = async () => {
    try {
      if (!selectedCategory) return;
      await deleteCategoryById(dispatch, selectedCategory._id);
      setDeleteOpen(false);
      getAllCategory(dispatch);
    } catch (error) {
      console.error("❌ Error deleting category -->> ", error);
    }
  };

  /* ------------------ UI ------------------ */

  return (
    <Box sx={{ p: 4, bgcolor: "#f9fafb", minHeight: "100vh" }}>
      <Paper sx={{ maxWidth: 1000, mx: "auto", borderRadius: 3 }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight={700}>
            Categories
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage product categories
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                <TableCell>Image</TableCell>
                <TableCell>Category Name</TableCell>
                <TableCell>Category ID</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat._id} hover>
                  <TableCell>
                    <Avatar
                      src={cat.image}
                      variant="rounded"
                      sx={{ width: 56, height: 56 }}
                    />
                  </TableCell>

                  <TableCell>
                    <Typography fontWeight={600}>{cat.name}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography color="text.secondary">{cat._id}</Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                    >
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditOpen(cat)}
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          setSelectedCategory(cat);
                          setDeleteOpen(true);
                        }}
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
      </Paper>

      {/* ---------------- EDIT MODAL ---------------- */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle fontWeight={700}>Edit Category</DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Category ID: <b>{selectedCategory?._id}</b>
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Stack spacing={3}>
            <TextField
              label="Category Name"
              name="name"
              fullWidth
              value={selectedCategory?.name || ""}
              onChange={handleEditChange}
            />

            <Box
              sx={{
                border: "2px dashed #cbd5e1",
                borderRadius: 2,
                p: 2,
                textAlign: "center",
              }}
            >
              <Avatar
                src={selectedCategory?.imagePreview || selectedCategory?.image}
                variant="rounded"
                sx={{ width: 140, height: 140, mx: "auto", mb: 2 }}
              />

              <Button component="label" startIcon={<CloudUploadOutlinedIcon />}>
                Upload Image
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e.target.files[0])}
                />
              </Button>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleUpdateCategory}
            sx={{ bgcolor: "black", "&:hover": { bgcolor: "#111" } }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* ---------------- DELETE CONFIRMATION DIALOG ---------------- */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete category "
          <b>{selectedCategory?.name}</b>"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteCategory}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
