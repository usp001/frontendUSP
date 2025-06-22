
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
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
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

export default function DataTable({ onDataChange }) {
  const [rows, setRows] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [bgColor, setBgColor] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const [selectedRow, setSelectedRow] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    info: "",
    venue: "",
    startDate: "",
    endDate: "",
  });

  const fetchEvents = async () => {
    try {
      const response = await axios.post(
        "https://backend-production-fc3a.up.railway.app/api/event/listEvent",
        { department: [] },
        { headers: { "Content-Type": "application/json" } }
      );
      const result = await response.data;

      if (result.message === "event list retrieved") {
        const formattedData = result.data.map((item) => ({
          id: item.id,
          title: item.title,
          startDate: item.startDate,
          endDate: item.endDate,
          info: item.info,
          venue: item.venue,
          department: item.department,
        }));
        setRows(formattedData);
        onDataChange();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // UseEffect to fetch data on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Title", width: 130 },
    { field: "department", headerName: "department", width: 200 },
    {
      field: "startDate",
      headerName: "startDate",
      width: 100,
    },
    {
      field: "endDate",
      headerName: "endDate",
      width: 130,
    },
    {
      field: "info",
      headerName: "info",
      width: 170,
    },
    {
      field: "venue",
      headerName: "venue",
      width: 170,
    },
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
        "https://backend-production-fc3a.up.railway.app/api/event/removeEvent",
        {
          data: { id: selectedRow.id },
        }
      );
      setSnackbarMessage(response.data.message);
      setBgColor(green[500]);
      setSnackbarOpen(true);
      setDeleteModalOpen(false);
      fetchEvents();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred";
      setSnackbarMessage(errorMessage);
      setBgColor(red[500]);
      setSnackbarOpen(true);
    }
  };

  const openUpdateModal = (row) => {
    console.log(`row on update modal: ${row.toString()}`);

    setSelectedRow(row);
    setFormData({
      title: row.title,
      info: row.info,
      venue: row.venue,
      startDate: row.startDate,
      endDate: row.endDate,
      department: row.department,
    });
    setUpdateModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        "https://backend-production-fc3a.up.railway.app/api/event/updateEvent",
        {
          id: selectedRow.id,
          title: formData.title,
          info: formData.info,
          venue: formData.venue,
          startDate: formData.startDate,
          endDate: formData.endDate,
          department: formData.department,
        }
      );
      console.log("response here:");

      console.log(response);

      setSnackbarMessage(response.data.message);
      setBgColor(green[500]);
      setSnackbarOpen(true);
      setUpdateModalOpen(false);
      fetchEvents();
    } catch (error) {
      console.log("response error here:");
      console.log(error);

      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred";
      setSnackbarMessage(errorMessage);
      setBgColor(red[500]);
      setSnackbarOpen(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
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
              Are you sure you want to delete the Event: "{selectedRow?.title}
              "?
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
            <h2 id="update-modal-title">Update Account</h2>
            <Box component="form" noValidate autoComplete="off"  marginLeft={"15%"} sx={{ mt: 2 }}>
              <TextField
                autoFocus
                margin="dense"
                name="title"
                label="Event Title"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.title}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="department"
                label="Department"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.department}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="info"
                label="Event Info"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.info}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="venue"
                label="Venue"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.venue}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="startDate"
                label="Start Date"
                type="datetime-local"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={formData.startDate}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="endDate"
                label="End Date"
                type="datetime-local"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={formData.endDate}
                onChange={handleInputChange}
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
