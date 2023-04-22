import { NavLink } from "react-router-dom";
import { HStack, Text, Heading } from "@chakra-ui/react";

export default function DashboardHeader() {
  return (
    <HStack justifyContent="space-between" w="100%" px="5" py="3" mb="5">
      <HStack as={NavLink} to="/">
        <Heading>MealCheck</Heading>
      </HStack>
      <Text fontWeight="600">Logout</Text>
    </HStack>
  );
}
