import { Outlet } from "react-router-dom";
import { VStack } from "@chakra-ui/react";
import DashboardHeader from "./DashboardHeader";
import Footer from "./Footer";

export default function DashboardLayout() {
  return (
    <VStack w="100%" h="100%" justifyContent="space-between">
      <DashboardHeader />
      <Outlet />
      <Footer />
    </VStack>
  );
}
