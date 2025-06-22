import React, { useEffect, useState } from "react";
import Calendar from "../../component/Calendar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import axios from "axios";
import "./Dashboard.css";
import DataTable from "../../component/CalendarTable";
import BarChart from "../../component/BarChart";
import BarJpiaChart from "../../component/BarChartJPIA";

function Dashboard() {
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshkey] = useState(0);
  const [eventDetails, setEventDetails] = useState({
    title: "",
    department: "",
    info: "",
    venue: "",
    startDate: "",
    endDate: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = async () => {
    try {
      // Send POST request to your API
      const response = await axios.post(
        "https://backend-production-fc3a.up.railway.app/api/event/addevent",
        eventDetails
      );
      console.log("Event added:", response.data);

      // Optionally clear the form and close the modal
      setEventDetails({
        title: "",
        department: "",
        info: "",
        venue: "",
        startDate: "",
        endDate: "",
      });
      handleClose();
      setRefreshkey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error(
        "Error adding event:",
        error.response?.data || error.message
      );
    }
  };
  const handleDataTableChange = () => {
    setRefreshkey((prevKey) => prevKey + 1); // Trigger Calendar refresh
  };

  useEffect(()=>{

  },[refreshKey])

  return (
    <>
      <div className="chartContainer"  >
        <BarChart/><BarJpiaChart/>
      </div>
      <div className="containerCalendar">
        
       <div className="addBtnContainer" style={{ paddingLeft: "25px" }}>
          <Button variant="contained" color="success" onClick={handleOpen}>
            ADD EVENT
          </Button>
        </div>
        <div className="TableofEventsContainer" style={{marginTop:'10px',paddingLeft:'25px'}} >
          <DataTable onDataChange={handleDataTableChange}/>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Event Title"
            type="text"
            fullWidth
            variant="outlined"
            value={eventDetails.title}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="department"
            label="Department"
            type="text"
            fullWidth
            variant="outlined"
            value={eventDetails.department}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="info"
            label="Event Info"
            type="text"
            fullWidth
            variant="outlined"
            value={eventDetails.info}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="venue"
            label="Venue"
            type="text"
            fullWidth
            variant="outlined"
            value={eventDetails.venue}
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
            value={eventDetails.startDate}
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
            value={eventDetails.endDate}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddEvent} color="primary">
            Add Event
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Dashboard;
