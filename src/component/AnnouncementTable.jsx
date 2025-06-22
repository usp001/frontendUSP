import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Autocomplete } from "@mui/material";
import { red, green } from "@mui/material/colors";
import { useState, useEffect } from "react";
import axios from "axios";
import PositionedSnackbar from "./SnackbarCustom";
import "./announcementTable.css";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",

  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

export default function AnnouncementTable() {
  const [rows, setRows] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [bgColor, setBgColor] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: [],
  });
  const [openFormData, setOpenFormData] = useState({
    title: "",
    description: "",
    department: [],
  });

  const fetchAnnouncement = async () => {
    try {
      const response = await fetch(
        "https://backend-production-fc3a.up.railway.app/api/announcement/get-announcementAdmin"
      );
      const result = await response.json();
      if (result.message === "success fetch") {
        const formattedData = result.data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          department: Array.isArray(item.department)
            ? item.department
            : JSON.parse(item.department),
        }));
        setRows(formattedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Title", width: 150 },
    { field: "description", headerName: "Description", width: 200 },
    { field: "department", headerName: "Department", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      sortable: false,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            size="small"
            style={{ marginRight: 10, backgroundColor: green[500] }}
            onClick={() => openUpdateModal(params.row)}
          >
            Update
          </Button>
          <Button
            variant="contained"
            size="small"
            style={{ marginRight: 10, backgroundColor: red[500] }}
            onClick={() => openDeleteModal(params.row)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  const openDeleteModal = (row) => {
    setSelectedRow(row);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        "https://backend-production-fc3a.up.railway.app/api/announcement/delete-announcement",
        {
          data: { id: selectedRow.id },
        }
      );
      setSnackbarMessage(response.data.message);
      setBgColor(green[500]);
      setSnackbarOpen(true);
      setDeleteModalOpen(false);
      fetchAnnouncement();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred";
      setSnackbarMessage(errorMessage);
      setBgColor(red[500]);
      setSnackbarOpen(true);
    }
  };

  const openUpdateModal = (row) => {
    setSelectedRow(row);
    setFormData({
      title: row.title,
      description: row.description,
      department: Array.isArray(row.department)
        ? row.department
        : JSON.parse(row.department),
    });
    setUpdateModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.post(
        "https://backend-production-fc3a.up.railway.app/api/announcement/update-announcement",
        {
          id: selectedRow.id,
          title: formData.title,
          description: formData.description,
          department: formData.department,
        }
      );
      setSnackbarMessage(response.data.message);
      setBgColor(green[500]);
      setSnackbarOpen(true);
      setUpdateModalOpen(false);
      fetchAnnouncement();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred";
      setSnackbarMessage(errorMessage);
      setBgColor(red[500]);
      setSnackbarOpen(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "department" ? value.split(",") : value,
    }); // Split departments if comma-separated
  };

  const openAddModel = () => {
    setOpenFormData({
      title: "",
      description: "",
      department: [],
    });
    setAddModalOpen(true);
  };
  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setOpenFormData({
      ...openFormData,
      [name]: name === "department" ? value.split(",") : value,
    });
  };
  const handleAdd = async () => {
    try {
      const response = await axios.post(
        "https://backend-production-fc3a.up.railway.app/api/announcement/create-announcement",
        {
          title: openFormData.title,
          description: openFormData.description,
          department: openFormData.department,
        }
      );
      setSnackbarMessage(response.data.message);
      setBgColor(green[500]);
      setSnackbarOpen(true);
      setAddModalOpen(false);
      fetchAnnouncement();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred";
      setSnackbarMessage(errorMessage);
      setBgColor(red[500]);
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <div className="addBtnContainer">
        <Button
          variant="contained"
          color="success"
          onClick={openAddModel}
          //   sx={{
          //     backgroundColor: green[500],
          //   }}
        >
          Add
        </Button>
      </div>
      <Paper sx={{ height: "100%", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10]}
          sx={{ border: 0 }}
        />

        <PositionedSnackbar
          open={snackbarOpen}
          message={snackbarMessage}
          onClose={() => setSnackbarOpen(false)}
          bgColor={bgColor}
        />

        {/* Add Announcement Modal */}
        <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)}>
          <Box
            sx={modalStyle}
            style={{
              justifyContent: "center",
            }}
          >
            <h2>Add New Announcement</h2>
            <Box component="form" noValidate autoComplete="off"  marginLeft={"3%"} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                margin="normal"
                label="Title"
                name="title"
                value={openFormData.title}
                onChange={handleAddInputChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Description"
                name="description"
                value={openFormData.description}
                onChange={handleAddInputChange}
              />
              <Autocomplete
                multiple
                sx={{ width: "100%" }}
                options={[
                  "CTHM",
                  "CCST",
                  "CTED",
                  "CAS",
                  "CHK",
                  "COE",
                  "COA",
                  "CNHS",
                ]} // Replace with your department options
                getOptionLabel={(option) => option}
                value={openFormData.department}
                onChange={(event, value) =>
                  setOpenFormData({ ...openFormData, department: value })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Department" margin="normal" />
                )}
              />
            </Box>
            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Button variant="contained" color="primary" onClick={handleAdd}>
                Save
              </Button>
              <Button
                variant="contained"
                onClick={() => setAddModalOpen(false)}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
        {/* Delete Confirmation Modal */}
        <Modal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          aria-labelledby="delete-modal-title"
          aria-describedby="delete-modal-description"
        >
          <Box sx={modalStyle}>
            <h2 id="delete-modal-title">Confirm Deletion</h2>
            <p id="delete-modal-description">
              Are you sure you want to delete the announcement titled "
              {selectedRow?.title}"?
            </p>
            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Button variant="contained" color="error" onClick={handleDelete}>
                Confirm
              </Button>
              <Button
                variant="contained"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Update Modal */}
        <Modal
          open={updateModalOpen}
          onClose={() => setUpdateModalOpen(false)}
          aria-labelledby="update-modal-title"
          aria-describedby="update-modal-description"
        >
          <Box sx={modalStyle}>
            <h2 id="update-modal-title">Update Announcement</h2>
            <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                margin="normal"
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
              <Autocomplete
                multiple
                options={[
                  "CTHM",
                  "CCST",
                  "CTED",
                  "CAS",
                  "CHK",
                  "COE",
                  "COA",
                  "CNHS",
                ]} // Replace with your department options
                getOptionLabel={(option) => option}
                value={formData.department}
                onChange={(event, value) =>
                  setFormData({ ...formData, department: value })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Department" margin="normal" />
                )}
              />
            </Box>
            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdate}
              >
                Save
              </Button>
              <Button
                variant="contained"
                onClick={() => setUpdateModalOpen(false)}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      </Paper>
    </>
  );
}
