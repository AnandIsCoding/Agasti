import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Avatar,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";

import { createCategory } from "../../api/api.js";

export default function AdminCreateCategory() {
  const [title, setTitle] = React.useState("");
  const [image, setImage] = React.useState(null);

  /* ------------------ HANDLERS ------------------ */
  const handleImageChange = (file) => {
    if (!file) return;
    setImage(file);
  };

  const handleSubmit = async () => {
    if (!title || !image) return;

    try {
      const formData = new FormData();
      formData.append("name", title); // backend expects `name`
      formData.append("image", image);

      await createCategory(formData);

      setTitle("");
      setImage(null);
    } catch (error) {
      // toast already handled in api layer
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#f9fafb", minHeight: "100vh" }}>
      <Paper
        sx={{
          maxWidth: 500,
          mx: "auto",
          p: 4,
          borderRadius: 3,
          border: "1px solid #e5e7eb",
        }}
      >
        {/* HEADER */}
        <Typography variant="h6" fontWeight={700} mb={3}>
          Create Category
        </Typography>

        {/* IMAGE UPLOAD */}
        <Box
          sx={{
            border: "1px dashed #cbd5f5",
            borderRadius: 2,
            p: 2,
            textAlign: "center",
            mb: 3,
          }}
        >
          <Avatar
            variant="rounded"
            src={image ? URL.createObjectURL(image) : ""}
            sx={{
              width: "100%",
              height: 160,
              mb: 1,
              bgcolor: "#f1f5f9",
            }}
          />

          <Button
            component="label"
            startIcon={<CloudUploadIcon />}
            size="small"
          >
            Upload Category Image
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files[0])}
            />
          </Button>
        </Box>

        {/* TITLE */}
        <TextField
          label="Category Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
        />

        {/* ACTIONS */}
        <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined">Cancel</Button>
          <Button
            variant="contained"
            sx={{ px: 4, fontWeight: 600 }}
            onClick={handleSubmit}
            disabled={!title || !image}
          >
            Create
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
