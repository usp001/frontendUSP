import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "./pages/layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Organization from "./component/Organization";
import CheckToken from "./CheckToken";
import CheckUser from "./CheckUser";
import LoginPage from "./pages/login/loginPage";
import Announcement from "./pages/announcement/Announcement";
import Jpia from "./pages/FinancialReport/Jpia";
import Accounts from "./pages/Accounts/Accounts";
import LayoutUser from "./pages/LayoutUser/LayoutUser";
import UploadPDF from "./component/Accomplishment";
import CalendarView from "./userComponent/CalendarView";
import UploadJPIA from "./userComponent/JpiaTableView";
import AnnouncementBox from "./userComponent/AnnouncementUser";
import ForgotPassword from "./pages/forgotPass/ForgotPass";
import ChangePassword from "./pages/changePass/ChangePass";
import EnterOtp from "./pages/VerifyOtp/EnterOtp";
import AdminCalendarView from "./component/adminCalendar";

function App() {
  const isAuth = true;
  return (
    <Routes>
      //surround the path a condition if true auth if not redirect to other
      route
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgotPass" element={<ForgotPassword />} />
      <Route path="/enter-otp" element={<EnterOtp />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route
        path="/admin"
        element={
          <CheckToken>
            <Layout />
          </CheckToken>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="admincalendar" element={<AdminCalendarView />} />
        <Route path="organization" element={<Organization />} />
        <Route path="announcement" element={<Announcement />} />
        <Route path="JPIA" element={<Jpia />} />
        <Route path="CreateAccount" element={<Accounts />} />
      </Route>
      <Route
        path="/user"
        element={
          <CheckUser>
            <LayoutUser />
          </CheckUser>
        }
      >
        <Route index element={<Navigate to="Calendar" replace />} />
        <Route path="Calendar" element={<CalendarView />}></Route>
        <Route path="Accomplishment" element={<UploadPDF />} />
        <Route path="JPIA" element={<UploadJPIA />} />
        <Route path="announcement" element={<AnnouncementBox />} />
      </Route>
    </Routes>
  );
}
export default App;
