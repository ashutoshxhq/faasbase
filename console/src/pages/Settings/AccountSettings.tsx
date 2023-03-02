import { useAuth0 } from "@auth0/auth0-react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useColorModeValue,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import React, { useEffect, useState } from "react";
import { getUser, updateUser } from "../../api/users";
import { APP_URI } from "../../config/constants";

const AccountSettings = () => {

    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef<any>();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const { logout } = useAuth0()
    const { getAccessTokenSilently, getIdTokenClaims, user } = useAuth0();

    const currentUserQuery = useQuery([`current-user`, { getAccessTokenSilently, getIdTokenClaims }], getUser)
    const queryClient = useQueryClient()

    const mutation = useMutation(({ id, data }: { id: string, data: any }) => updateUser(id, data, getAccessTokenSilently), {
        onSuccess: () => {
            queryClient.invalidateQueries([`current-user`])
            toast({
                title: "Success",
                description: "User updated successfully",
                status: "success",
                position: "bottom-right",
                duration: 5000,
                isClosable: true,
            });
        },

        onError: () => {
            toast({
                title: "Failed",
                description: "Unable to update user",
                status: "error",
                position: "bottom-right",
                duration: 5000,
                isClosable: true,
            });
        }
    })

    useEffect(() => {
        if (currentUserQuery?.data) {
            setEmail(currentUserQuery.data?.data?.data?.email || "")
            setFirstName(currentUserQuery.data?.data?.data?.firstname || "")
            setLastName(currentUserQuery.data?.data?.data?.lastname || "")
        }

    }, [])

    const handleLogout = async () => {
        localStorage.clear()
        logout({ returnTo: APP_URI })
        onClose();
    };

    useEffect(() => {
        document.title = "Faasbase Console | Account Settings"
      }, [])

    return (
        <Box height={"calc(100vh - 40px)"} overflowY={"scroll"}>
            <Box as="section" mt={4} py={4} px={4} borderBottom={"solid 1px #42424252"} data-tauri-drag-region>
                <Stack spacing="5">
                    <Stack
                        data-tauri-drag-region
                        spacing="4"
                        direction={{ base: "column", sm: "row" }}
                        justify="space-between"
                        alignItems={"center"}
                    >
                        <Box>
                            <Text fontSize="2xl" fontWeight="medium">
                                Account Settings
                            </Text>
                            <Text color="muted" fontSize="sm">
                                Update your personal profile here
                            </Text>
                        </Box>

                    </Stack>
                </Stack>
            </Box>
            <Box
                display={"flex"}
                justifyContent={"start"}
                alignContent={"start"}
                flexDirection={"column"}
                flexWrap={"wrap"}
                gap={"30px"}
                p={4}
            >

                <Box as="section" w={"100%"}>
                    <Container maxW={"full"} px={0}>
                        <Box
                            bg={"#1e1e1e"}
                            boxShadow={useColorModeValue("sm", "sm-dark")}
                            borderRadius="lg"
                            p={{ base: "4", md: "6" }}
                        >
                            <FormControl mb={8}>
                                <FormLabel htmlFor="firstname">Firstname</FormLabel>
                                <Input
                                    id="firstname"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    type="text"
                                />
                            </FormControl>
                            <FormControl mb={8}>
                                <FormLabel htmlFor="lastname">Lastname</FormLabel>
                                <Input
                                    id="lastname"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    type="text"
                                />
                            </FormControl>
                            <FormControl mb={8}>
                                <FormLabel htmlFor="email">Email Address</FormLabel>
                                <Input
                                    id="email"
                                    disabled
                                    value={email}
                                    type="email"
                                />
                            </FormControl>
                            <FormControl mb={8}>
                                <FormLabel htmlFor="username">Username</FormLabel>
                                <Input
                                    id="username"
                                    disabled
                                    value={user?.nickname || ""}
                                    type="text"
                                />
                            </FormControl>
                            <Box display={"flex"} justifyContent="left" mt={8}>
                                <Button
                                    variant="solid"
                                    bgGradient='linear(to-r, orange.500, orange.600)'
                                    _hover={{ backgroundColor: "orange.500" }}
                                    _active={{ backgroundColor: "orange.500" }}
                                    isLoading={mutation.isLoading}
                                    onClick={async () => {
                                        let claims = await getIdTokenClaims();

                                        mutation.mutate({
                                            id: claims?.user_id,
                                            data: {
                                                firstname: firstName,
                                                lastname: lastName,
                                            }
                                        })
                                    }}
                                    loadingText="Updating"
                                >
                                    Update Account
                                </Button>
                            </Box>
                        </Box>
                    </Container>
                </Box>
                <Box as="section" mt={6}>
                    <Container maxW={"full"} px={0}>
                        <Box
                            bg={"#1e1e1e"}
                            boxShadow={useColorModeValue("sm", "sm-dark")}
                            borderRadius="lg"
                            p={{ base: "4", md: "6" }}
                        >
                            <Stack
                                direction={{ base: "column", md: "row" }}
                                spacing={{ base: "5", md: "6" }}
                                justify="space-between"
                                align={"center"}
                            >
                                <Stack>
                                    <Text fontSize="lg" fontWeight="medium">
                                        Logout From application
                                    </Text>
                                </Stack>
                                <Box>
                                    <Button
                                        variant="solid"
                                        bg={"red.500"}
                                        _hover={{ backgroundColor: "red.600" }}
                                        _active={{ backgroundColor: "red.600" }}
                                        onClick={onOpen}
                                    >
                                        Logout from Faasbase
                                    </Button>
                                </Box>
                            </Stack>
                        </Box>
                    </Container>
                </Box>
                <AlertDialog
                    isOpen={isOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={onClose}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent bg={"#1e1e1e"}>
                            <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                Logout
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                Are you sure? You can't undo this action afterwards.
                            </AlertDialogBody>

                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    bg={"red.500"}
                                    _hover={{ backgroundColor: "red.600" }}
                                    _active={{ backgroundColor: "red.600" }}
                                    onClick={handleLogout}
                                    ml={3}
                                >
                                    Logout
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>

            </Box>
        </Box>
    )
}

export default AccountSettings