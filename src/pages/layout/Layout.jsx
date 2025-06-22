import "./Layout.css";
import Sidebar from "../../component/Sidebar";
import { Outlet,useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";
function Layout() {

  // const [token,setToken] = useState(localStorage.getItem('token'))
  // const navigate = useNavigate()
  // useEffect(() => {
  //   let token = localStorage.getItem('token')
  //   if(!token){
  //     navigate('/login')
  //   }
  // }, []);

  return (
    <>
      <div className="mainContainer">
        <div className="sideBarContainer">
          <Sidebar />
        </div>
        <div className="contentContainer">
          <Outlet />
        </div>
      </div>
    </>
  );
}
export default Layout;
