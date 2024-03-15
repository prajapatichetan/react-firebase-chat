import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "../../redux/store";
import { Stack } from "@mui/material";
import SideBar from "./SideBar";

const DashboardLayout = () => {
  const isLoggedIn = useSelector((state) => state.userData.isLoggedIn);
  if (!isLoggedIn) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <Stack direction="row">
      {/* SideBar */}
      <SideBar />
      <Outlet />
    </Stack>
  );
};

export default DashboardLayout;
