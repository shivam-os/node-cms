import {
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userLoginSchema } from "../utils/validators";
// import api from "../api/serverData";
import { useToast } from "@chakra-ui/react";

export default function Login() {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(userLoginSchema) });

  const handleLoginSubmit = async (data) => {
    // try {
    //   const response = await api.post("/user/login", data);
    //   console.log(response)
    //   toast({
    //     variant: "subtle",
    //     description: response.data.msg,
    //     status: "success",
    //     duration: 9000,
    //     isClosable: true,
    //   });
    // } catch (err) {
    //   console.log(err);
    //   toast({
    //     variant: "subtle",
    //     description: err.response.data.err,
    //     status: "error",
    //     duration: 9000,
    //     isClosable: true,
    //   });
    // }
    console.log(data);
  };

  return (
    <VStack spacing="2rem" p="3rem" boxShadow="lg">
      <Heading>Login</Heading>
      <form onSubmit={handleSubmit(handleLoginSubmit)}>
        <FormControl isRequired className="form-items" isInvalid={errors.email}>
          <FormLabel>Email</FormLabel>
          <Input placeholder="Email" {...register("email")} type="email" />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>
        <FormControl
          isRequired
          className="form-items"
          isInvalid={errors.password}
        >
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="Password"
            {...register("password")}
            type="password"
          />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>
        <Button colorScheme="green" type="submit" w="100%">
          Login
        </Button>
      </form>
    </VStack>
  );
}
