import { HStack, Heading, Text } from "@chakra-ui/react";
import { hover } from "@testing-library/user-event/dist/hover";
import {NavLink} from "react-router-dom"

export default function PublicHeader() {
  return (
    <HStack w="100%" justifyContent="space-between" p="1rem">
      <Heading as={NavLink} to="/">NodeCms</Heading>
      <HStack>
      <Text className="header-link" as={NavLink}>JavaScript</Text>
      <Text className="header-link" as={NavLink}>Python</Text>
      <Text className="header-link" as={NavLink}>Linux</Text>
      <Text className="header-link" as={NavLink}>FrontEnd</Text>
      </HStack>
    </HStack>
  )
}
