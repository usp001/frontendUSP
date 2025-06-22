import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import DataTable from "../userComponent/ARuserTable";

const UploadPDF = () => {
  const userDepartment = localStorage.getItem("department");
  console.log("department here user");

  console.log(userDepartment);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: userDepartment,
    file: null,
  });
  const [message, setMessage] = useState(null);
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshkey] = useState(0);

  // Handle modal open/close
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ title: "", description: "", file: null });
    setMessage(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      file: e.target.files[0], // Capture the file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null); // Reset message

    if (!formData.file) {
      setMessage("Please select a file to upload.");
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("department", formData.department);
      data.append("file", formData.file);

      const response = await axios.post("https://backend-production-fc3a.up.railway.app/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setRefreshkey((prevKey) => prevKey + 1);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.error || "An error occurred during the upload."
      );
    }
  };
  useEffect(() => {}, [refreshKey]);

  return (
    <>
      <div className="containerAccomplishment">
        <div className="btnContainerUpload">
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Upload PDF
          </Button>
        </div>
        <div className="containerDataTable">
          <DataTable refreshKey={refreshKey}></DataTable>
        </div>
      </div>

      <Dialog open={open} onClose={handleClose} maxWidth="sm">
        <DialogTitle>Upload PDF</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 2 }}
            style={{ justifyContent: "center" }}
          >
            <Stack spacing={2} style={{ margin: 0, padding: 0 }}>
              <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
              />

              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                required
              />

              <Button variant="contained" component="label">
                Choose File
                <input
                  type="file"
                  hidden
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
              </Button>

              {formData.file && (
                <Typography variant="body2" color="text.secondary">
                  Selected File: {formData.file.name}
                </Typography>
              )}

              {message && (
                <Typography
                  variant="body2"
                  color={
                    message.toLowerCase().includes("error")
                      ? "error"
                      : "success.main"
                  }
                >
                  {message}
                </Typography>
              )}
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            type="submit"
            form="upload-form"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UploadPDF;
