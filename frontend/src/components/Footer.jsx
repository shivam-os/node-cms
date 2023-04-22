import { NavLink } from "react-router-dom";
import { Center } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Center bgColor="gray.100" w="100%" color="gray.700" p="1.5rem">
      Made with ❤️ by
      <NavLink to="https://github.com/shivam-os" target="_blank">
        <u style={{ marginLeft: '.25rem' }}>Shivam</u>
      </NavLink>
    </Center>
  );
}
