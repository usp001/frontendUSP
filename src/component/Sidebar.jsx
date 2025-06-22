import uspLogo from "../assets/USPlogo.jpg";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { red, blue, lightGreen, green } from "@mui/material/colors";

function Sidebar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token
    navigate("/login"); // Redirect to the login page
  };
  return (
    <div className="sidebarContents">
      <div className="title-container">
        <img src={uspLogo} alt="" className="uspLogo" />
      </div>
      <nav>
        <ul>
          <li>
            <NavLink
              to="dashboard"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink
              to="admincalendar"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Calendar
            </NavLink>
          </li>

          <li>
            <NavLink
              to="organization"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Organization
            </NavLink>
          </li>
          <li>
            <NavLink
              to="announcement"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Announcement
            </NavLink>
          </li>
          <li>
            <NavLink
              to="JPIA"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              JPIA
            </NavLink>
          </li>
          <li>
            <NavLink
              to="CreateAccount"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Create Account
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="logOut-container">
        <Button

          variant="contained"
          size="small"
          style={{ marginRight: 10, backgroundColor: green[800] }}
          onClick={handleLogout}
        >
          logout
        </Button>
      </div>
    </div>
  );
}
export default Sidebar;
