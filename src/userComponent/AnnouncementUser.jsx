import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Typography,
  Grid,
  Chip,
} from "@mui/material";

function AnnouncementBox() {
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch announcements from the API
    const fetchData = async () => {
      try {
        const departmentLocal = await localStorage.getItem('department')
        const response = await axios.post(
          "https://backend-production-fc3a.up.railway.app/api/announcement/get-announcement",
          {
            department: [departmentLocal],
          },
          { Headers: { "Content-type": "application/json" } }
        );
        setAnnouncements(response.data.data)
      } catch (error) {
        setError("Failed to fetch announcements.")
        console.log(error);
        
      }
    };
   
    fetchData();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      {error && (
        <Typography variant="body2" color="error" sx={{ marginBottom: 2 }}>
          {error}
        </Typography>
      )}
      {!error && announcements.length == 0 && (
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ marginBottom: 2 }}
        >
          No announcements available.
        </Typography>
      )}
      <Grid container spacing={3}>
        {announcements.map((announcement) => (
          <Grid item xs={12} sm={6} md={4} key={announcement.id}>
            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {announcement.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ marginTop: 1 }}
                >
                  {announcement.description}
                </Typography>
                <Box sx={{ marginTop: 2 }}>
                  {JSON.parse(announcement.department).map((dept) => (
                    <Chip
                      key={dept}
                      label={dept}
                      variant="outlined"
                      color="primary"
                      sx={{ marginRight: 1 }}
                    />
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <Typography variant="caption" color="textSecondary">
                  {new Date(announcement.createdAt).toLocaleString()}
                </Typography>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default AnnouncementBox;
