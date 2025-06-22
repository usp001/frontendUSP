import * as React from "react";
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

// FullCalendar imports
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // allows events to be draggable and editable

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

export default function AdminCalendarView({ onDataChange }) {
  const [rows, setRows] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [bgColor, setBgColor] = useState("");

  const [addEventModalOpen, setAddEventModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    info: "",
    venue: "",
    startDate: "",
    endDate: "",
  });

  // Fetch events from backend API
  const fetchEvents = async () => {
    try {
      const response = await axios.post(
        "https://backend-production-fc3a.up.railway.app/api/event/listEvent",
        { department: [] },
        { headers: { "Content-Type": "application/json" } }
      );
      const result = response.data;

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
        onDataChange(); // Notify parent component to refresh
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle adding new event
  const handleAddEvent = async () => {
    try {
      const response = await axios.post(
        "https://backend-production-fc3a.up.railway.app/api/event/addEvent",
        {
          title: formData.title,
          department: formData.department,
          info: formData.info,
          venue: formData.venue,
          startDate: formData.startDate,
          endDate: formData.endDate,
        }
      );
      setSnackbarMessage(response.data.message);
      setBgColor(green[500]);
      setSnackbarOpen(true);
      setAddEventModalOpen(false);
      fetchEvents();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred";
      setSnackbarMessage(errorMessage);
      setBgColor(red[500]);
      setSnackbarOpen(true);
    }
  };

  // Format events for FullCalendar
  const calendarEvents = rows.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.startDate,
    end: event.endDate,
    description: event.info,
    venue: event.venue,
  }));

  return (
    <Paper sx={{ height: "100%", width: "100%" }}>
      {/* FullCalendar */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        events={calendarEvents}
        select={(info) => {
          setAddEventModalOpen(true);
          setFormData({
            ...formData,
            startDate: info.startStr,
            endDate: info.endStr,
          });
        }}
        eventClick={(info) => alert(`Event: ${info.event.title}`)}
        style={{ width: "80%", height: "400px", margin: "0 auto" }}
      />

      <PositionedSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
        bgColor={bgColor}
      />

      {/* Add Event Modal */}
      <Modal
        open={addEventModalOpen}
        onClose={() => setAddEventModalOpen(false)}
        aria-labelledby="add-event-modal-title"
        aria-describedby="add-event-modal-description"
      >
        <Box sx={modalStyle}>
          <h2 id="add-event-modal-title" style={{ textAlign: "center", }}>
            Add New Event
          </h2>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            marginLeft={"15%"}
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <TextField
              autoFocus
              name="title"
              label="Event Title"
              type="text"
              variant="outlined"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              sx={{ width: "100%", maxWidth: "340px" }}
            />
            <TextField
              name="department"
              label="Department"
              type="text"
              variant="outlined"
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              sx={{ width: "100%", maxWidth: "340px" }}
            />
            <TextField
              name="info"
              label="Event Info"
              type="text"
              variant="outlined"
              value={formData.info}
              onChange={(e) =>
                setFormData({ ...formData, info: e.target.value })
              }
              sx={{ width: "100%", maxWidth: "340px" }}
            />
            <TextField
              name="venue"
              label="Venue"
              type="text"
              variant="outlined"
              value={formData.venue}
              onChange={(e) =>
                setFormData({ ...formData, venue: e.target.value })
              }
              sx={{ width: "100%", maxWidth: "340px" }}
            />
            <TextField
              name="startDate"
              label="Start Date"
              type="datetime-local"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              sx={{ width: "100%", maxWidth: "340px" }}
            />
            <TextField
              name="endDate"
              label="End Date"
              type="datetime-local"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              sx={{ width: "100%", maxWidth: "340px" }}
            />
          </Box>
          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              sx={{ backgroundColor: green[500] }}
              onClick={handleAddEvent}
            >
              Add Event
            </Button>
            <Button
              variant="contained"
              onClick={() => setAddEventModalOpen(false)}
              sx={{ backgroundColor: red[500] }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Paper>
  );
}
