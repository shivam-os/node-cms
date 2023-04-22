import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import PublicHeader from "./PublicHeader";

export default function PublicLayout() {
  return (
    <>
      <PublicHeader />
      <Outlet />
      <Footer />
    </>
  );
}
