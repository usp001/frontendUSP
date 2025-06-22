import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiBell } from "react-icons/fi"; // bell icon
import axios from "axios";
import SidebarUser from "../../component/SideBarUser";
import "./Layout.css"; // optional: for modal styling

function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // in seconds

  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  if (diff < 2592000) return `${Math.floor(diff / 604800)}w`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo`;
  return `${Math.floor(diff / 31536000)}y`;
}

function LayoutUser() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const departmentLocal = localStorage.getItem("department");

        const response = await axios.get(
          "https://backend-production-fc3a.up.railway.app/api/notif/fetch",
          {
            params: {
              department: departmentLocal,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data.data;
        setNotifications(typeof data === "string" ? [] : data);
      } catch (error) {
        setError("Failed to fetch announcements.");
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="mainContainer">
        <div className="sideBarContainer">
          <SidebarUser />
        </div>
        <div className="contentContainer">
          <Outlet />
        </div>

        {/* Floating Notification Button */}
        <button className="notifButton" onClick={() => setIsNotifOpen(true)}>
          <FiBell size={24} />
        </button>

        {/* Notification Modal */}
        {isNotifOpen && (
          <div
            className="notifModalOverlay"
            onClick={() => setIsNotifOpen(false)}
          >
            <div className="notifModal" onClick={(e) => e.stopPropagation()}>
              <div className="notifHeader">
                <h2>Notifications</h2>
                <button onClick={() => setIsNotifOpen(false)}>✖</button>
              </div>
              <div className="notifContent">
                {Array.isArray(notifications) && notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div key={notif.id} className="notifItem">
                      <div className="notifItemHeader">
                        <h4>{notif.title}</h4>
                        <span className="notifTime">
                          {getTimeAgo(notif.createdAt)}
                        </span>
                      </div>
                      <p className="notifMessage">{notif.message}</p>
                    </div>
                  ))
                ) : (
                  <p>No new notifications.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default LayoutUser;
