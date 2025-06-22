import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { red, blue, lightGreen, green } from "@mui/material/colors";
import { useState, useEffect } from "react";
import PdfViewer from "./JpiaPdfViewer";
import axios from "axios";
import PositionedSnackbar from "./SnackbarCustom";

export default function DataTable() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [bgColor, setBgColor] = useState("");

  // Fetch data function
  const fetchAr = async () => {
    try {
      const response = await fetch(
        "https://backend-production-fc3a.up.railway.app/api/financial/adminFr"
      );
      const result = await response.json();
      console.log(response);
      if (result.data === "no reports found")
        throw new Error("no reports found");

      if (result.message === "Financial Report for admin") {
        const formattedData = result.data.map((item) => ({
          id: item.id,
          title: item.title,
          filename: item.fileName,
          size: item.size,
          status: item.status,
          department: item.department,
        }));
        setRows(formattedData);
        setSnackbarMessage(result.message);
        setBgColor(green[500]);
        setSnackbarOpen(true);
        // setUpdateModalOpen(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      const errorMessage = error.message || "An unexpected error occurred";
      setSnackbarMessage(errorMessage);
      setBgColor(red[500]);
      setSnackbarOpen(true);
    }
  };

  // UseEffect to fetch data on mount
  useEffect(() => {
    fetchAr();
  }, []); // Empty dependency array ensures it runs only once

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Title", width: 130 },
    { field: "filename", headerName: "Filename", width: 200 },
    {
      field: "size",
      headerName: "Size (bytes)",
      width: 100,
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
    },
    {
      field: "department",
      headerName: "Department",
      width: 170,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 500,
      sortable: false,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            size="small"
            style={{ marginRight: 10, backgroundColor: blue[400] }}
            onClick={() => handleView(params.row)}
          >
            View
          </Button>

          <Button
            variant="contained"
            size="small"
            style={{ marginRight: 10, backgroundColor: green[500] }}
            onClick={() => handleApprove(params.row)}
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            style={{ marginRight: 10, backgroundColor: red[500] }}
            onClick={() => handleReject(params.row)}
          >
            Reject
          </Button>
        </>
      ),
    },
  ];

  const handleApprove = async (row) => {
    console.log(`approving: ${row.id}`);
    try {
      const response = await axios.post(
        "https://backend-production-fc3a.up.railway.app/api/financial/approved",
        { id: row.id, department: row.department },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      setSnackbarMessage(response.data.message);
      setBgColor(green[500]); // Set the response message
      setSnackbarOpen(true); // Show the snackbar
      console.log(response.data);
      fetchAr();
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || error.response.data.error;
        setSnackbarMessage(errorMessage); // Set error message
      } else {
        setSnackbarMessage("An unexpected error occurred"); // Fallback for no response
      }
      alert("Failed to approve pdf");
    }
  };

  const handleReject = async (row) => {
    console.log(`Rejecting: ${row.id}`);
    try {
      const response = await axios.post(
        "https://backend-production-fc3a.up.railway.app/api/financial/reject",
        { id: row.id, department: row.department },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      setSnackbarMessage(response.data.message);
      setBgColor(green[500]); // Set the response message
      setSnackbarOpen(true); // Show the snackbar
      console.log(response.data);
      fetchAr();
    } catch (error) {
      console.log(error);

      if (error.response) {
        const errorMessage =
          error.response.data.message || error.response.data.error;
        setSnackbarMessage(errorMessage); // Set error message
      } else {
        setSnackbarMessage("An unexpected error occurred"); // Fallback for no response
      } // Set error message
      setBgColor(red[500]);
      setSnackbarOpen(true); // Show the snackbar
    }
  };

  const paginationModel = { page: 0, pageSize: 5 };

  const handleView = (row) => {
    setSelectedRow(row); // Set the selected row
    setOpen(true); // Open the modal
  };

  // Handle modal close
  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  useEffect(() => {
    console.log("Rows:", rows); // Debugging statement
  }, [rows]);

  return (
    <Paper sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{ border: 0 }}
      />
      <PdfViewer open={open} handleClose={handleClose} row={selectedRow} />
      <PositionedSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
        bgColor={bgColor}
      />
    </Paper>
  );
}
