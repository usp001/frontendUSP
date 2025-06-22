import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { red, green } from "@mui/material/colors";
import { useState, useEffect } from "react";
import axios from "axios";
import PositionedSnackbar from "./SnackbarCustom";
import "./announcementTable.css";
import { MenuItem } from "@mui/material";

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

const departmentOptions = [
  "CTHM",
  "CCST",
  "CTED",
  "CAS",
  "CHK",
  "COE",
  "COA",
  "CNHS",
];
export default function AccountsTable() {
  const [rows, setRows] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [bgColor, setBgColor] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formData, setFormData] = useState({
    fname: "",
    mname: "",
    lname: "",
    section: "",
    yearlvl: "",
    email: "",
    department: "",
  });
  const [openFormData, setOpenFormData] = useState({
    fname: "",
    mname: "",
    lname: "",
    section: "",
    yearlvl: "",
    password: "",
    email: "",
    department: "",
  });

  const fetchAccounts = async () => {
    try {
      const response = await fetch(
        "https://backend-production-fc3a.up.railway.app/api/user/fetchAccounts"
      );
      const result = await response.json();
      if (result.message === "success fetch") {
        const formattedData = result.data.map((item) => ({
          id: item.id,
          fname: item.fname,
          mname: item.mname,
          lname: item.lname,
          section: item.section,
          yearlvl: item.yearlvl,
          email: item.email,
          role: item.role,
          department: item.department,
        }));
        setRows(formattedData);
        setSnackbarMessage(result.message);
        setBgColor(green[500]);
        setSnackbarOpen(true);
        setUpdateModalOpen(false);
      }
    } catch (error) {
      console.log("error in fetch");

      console.log(error);

      const errorMessage = error.message || "An unexpected error occurred";
      setSnackbarMessage(errorMessage);
      setBgColor(red[500]);
      setSnackbarOpen(true);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "fname", headerName: "First Name", width: 150 },
    { field: "mname", headerName: "Middle Name", width: 200 },
    { field: "lname", headerName: "Last Name", width: 200 },
    { field: "section", headerName: "section", width: 200 },
    { field: "yearlvl", headerName: "yearlvl", width: 200 },
    { field: "email", headerName: "email", width: 200 },
    { field: "role", headerName: "role", width: 200 },
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
        "https://backend-production-fc3a.up.railway.app/api/user/delete-account",
        {
          data: { id: selectedRow.id },
        }
      );
      setSnackbarMessage(response.data.message);
      setBgColor(green[500]);
      setSnackbarOpen(true);
      setDeleteModalOpen(false);
      fetchAccounts();
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
      fname: row.fname,
      mname: row.mname,
      lname: row.lname,
      section: row.section,
      yearlvl: row.yearlvl,
      email: row.email,
      department: row.department,
    });
    setUpdateModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.post(
        "https://backend-production-fc3a.up.railway.app/api/user/updateAccount",
        {
          id: selectedRow.id,
          fname: formData.fname,
          mname: formData.mname,
          lname: formData.lname,
          section: formData.section,
          yearlvl: formData.yearlvl,
          email: formData.email,
          department: formData.department,
        }
      );
      console.log("response here:");

      console.log(response);

      setSnackbarMessage(response.data.message);
      setBgColor(green[500]);
      setSnackbarOpen(true);
      setUpdateModalOpen(false);
      fetchAccounts();
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

  const openAddModel = () => {
    setOpenFormData({
      fname: "",
      mname: "",
      lname: "",
      section: "",
      yearlvl: "",
      password: "",
      department: "",
      email: "",
    });
    setAddModalOpen(true);
  };
  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setOpenFormData({ ...openFormData, [name]: value });
  };
  const handleAdd = async () => {
    try {
      const response = await axios.post(
        "https://backend-production-fc3a.up.railway.app/api/user/signUp",
        {
          fname: openFormData.fname,
          mname: openFormData.mname,
          lname: openFormData.lname,
          section: openFormData.section,
          yearlvl: openFormData.yearlvl,
          password: openFormData.password,
          department: openFormData.department,
          email: openFormData.email,
        }
      );
      setSnackbarMessage(response.data.message);
      setBgColor(green[500]);
      setSnackbarOpen(true);
      setAddModalOpen(false);
      fetchAccounts();
    } catch (error) {
      console.log(error);

      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred";
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
          Add Account
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
          <Box sx={modalStyle} style={{ width: 500 }}>
            <h2>Add New Account</h2>
            <Box
              style={{ justifyContent: "center" }}
              noValidate
              fullWidth
              autoComplete="off"
              sx={{ mt: 2 }}
            >
              <Stack direction={"row"} gap={1}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="First name"
                  name="fname"
                  value={openFormData.fname}
                  onChange={handleAddInputChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Middle Name"
                  name="mname"
                  value={openFormData.mname}
                  onChange={handleAddInputChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Lastname"
                  name="lname"
                  value={openFormData.lname}
                  onChange={handleAddInputChange}
                />
              </Stack>
              <Stack direction={"row"} gap={1}>
                <TextField
                  select
                  fullWidth
                  margin="normal"
                  label="Department"
                  name="department"
                  value={openFormData.department}
                  onChange={handleAddInputChange}
                >
                  {departmentOptions.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Section"
                  name="section"
                  value={openFormData.section}
                  onChange={handleAddInputChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Year Level"
                  name="yearlvl"
                  value={openFormData.yearlvl}
                  onChange={handleAddInputChange}
                />
              </Stack>
              <TextField
                fullWidth
                margin="normal"
                label="email"
                name="email"
                value={openFormData.email}
                onChange={handleAddInputChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="password"
                name="password"
                value={openFormData.password}
                onChange={handleAddInputChange}
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
              Are you sure you want to delete the Account: "{selectedRow?.fname}
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
          <Box sx={modalStyle} >
            <h2 id="update-modal-title">Update Account</h2>
            <Box component="form" marginLeft={"2%"} noValidate autoComplete="off" sx={{ mt: 2 } }>
              <TextField
                fullWidth
                margin="normal"
                label="First Name"
                name="fname"
                value={formData.fname}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Middle Name"
                name="mname"
                value={formData.mname}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Last Name"
                name="lname"
                value={formData.lname}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Section"
                name="section"
                value={formData.section}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Year Level"
                name="yearlvl"
                value={formData.yearlvl}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Department"
                name="department"
                value={formData.department}
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
