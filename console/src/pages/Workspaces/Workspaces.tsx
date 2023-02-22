import { useAuth0 } from '@auth0/auth0-react'
import { Box, Button, FormControl, FormLabel, IconButton, Input, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, Textarea, useDisclosure, useToast } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { FiLayers, FiMoreHorizontal } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { createWorkspace, getWorkspaces } from '../../api/workspaces'
import { currentWorkspaceState } from '../../store/workspaces'

const Workspaces = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [, setCurrentWorkspace] = useRecoilState(currentWorkspaceState);
    const { getAccessTokenSilently, getIdTokenClaims } = useAuth0();
    const query = useQuery(['workspaces', { getAccessTokenSilently }], getWorkspaces)
    const queryClient = useQueryClient()
    const toast = useToast()
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const createWorkspaceMutation = useMutation((data: any) => createWorkspace(data, getAccessTokenSilently), {
        onSuccess: () => {
            queryClient.invalidateQueries([`workspaces`])
            toast({
                title: "Success",
                description: "Workspace created successfully",
                status: "success",
                position: "bottom-right",
                duration: 5000,
                isClosable: true,
            });
            onClose()
        },

        onError: () => {
            toast({
                title: "Failed",
                description: "Unable to create workspace",
                status: "error",
                position: "bottom-right",
                duration: 5000,
                isClosable: true,
            });
        }
    })

    useEffect(() => {
        document.title = "Faasbase Console | Workspaces"
      }, [])

    return (
        <Box display={"flex"} bg="#121212" height={"100vh"} flexDirection="column">

            <Box height={"calc(100vh - 40px)"} display="flex" justifyContent={"start"} alignItems={"center"} flexDirection={"column"}>
                <Box display={"flex"} justifyContent="space-between" alignItems={"center"} w={"100%"} p={12}>
                    <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                        <Box mr={4}>
                            <FiLayers size={"40px"} />
                        </Box>
                        <Box>
                            <Text fontSize="2xl" fontWeight="medium">Workspaces</Text>
                            <Text color="muted" fontSize="sm">Manage all your workspaces from here</Text>
                        </Box>
                    </Box>


                    <Box>
                        <Button onClick={onOpen} variant="solid" bgGradient='linear(to-r, orange.500, orange.600)' _hover={{ backgroundColor: "orange.500" }} _active={{ backgroundColor: "orange.500" }}>Create New Workspace</Button>
                    </Box>

                </Box>

                <Box display={"flex"} justifyContent="start" alignItems={"start"} flexWrap={"wrap"} gap={6} w={"100%"} py={4} px={12}>

                    {query.data?.data.data.map((workspace: any) => <Box

                        cursor={"pointer"}
                        key={workspace?.id}
                        as="section"
                        borderRadius={8}
                        bg={"#1e1e1e"}
                        boxShadow={"2xl"}
                        border={"solid 0px #424242fd"}
                        px={8}
                        py={4}
                        flex={1}
                        minW={"30%"}
                        maxW={"33.33%"}
                        _hover={{ background: "#1e1e1e" }}
                    >
                        <Stack
                            // px={8}
                            direction={{ base: "column", sm: "row" }}
                            justify="space-between"
                            alignItems={"center"}
                        >
                            <Stack
                                direction={"row"}
                                alignItems={"center"}
                                justifyContent={'center'}
                                spacing={'8'}
                            >
                                <Box display={"flex"} flexDirection='column' justifyContent={"center"} onClick={() => {
                                    setCurrentWorkspace(workspace)
                                    navigate("/workspaces/" + workspace?.name + "/applications")
                                }}>
                                    <Text fontSize="lg" fontWeight="medium" mb={1}>
                                        {workspace?.name}
                                    </Text>
                                    <Text mt={1} color="muted" fontSize="sm" noOfLines={1}>
                                        {workspace?.description}
                                    </Text>
                                </Box>

                            </Stack>
                            <Stack direction="row">
                                <Menu size={"2xl"}>
                                    <MenuButton
                                        as={IconButton}
                                        _hover={{ backgroundColor: "whiteAlpha.200" }}
                                        _active={{ backgroundColor: "whiteAlpha.200" }}
                                        aria-label="Options"
                                        icon={<FiMoreHorizontal size={26} />}
                                        variant="ghost"
                                    />
                                    <MenuList bg={"#1e1e1e"} minW={"10px"}>
                                        <MenuItem bg={"#1e1e1e"} _hover={{ backgroundColor: "whiteAlpha.200" }}
                                            onClick={() => { }}
                                        >
                                            Settings
                                        </MenuItem>

                                        <MenuItem bg={"#1e1e1e"} _hover={{ backgroundColor: "whiteAlpha.200" }}
                                            onClick={async () => { }}
                                        >
                                            Delete
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </Stack>
                        </Stack>
                    </Box>)}


                </Box>
            </Box>
            <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
                <ModalOverlay />
                <ModalContent bg={"#1e1e1e"}>
                    <ModalHeader data-tauri-drag-region>Create New Workspace</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isRequired mb={8} mt={4}>
                            <FormLabel htmlFor="name">Workspace Name</FormLabel>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Workspace Name"
                            />
                        </FormControl>

                        <FormControl isRequired mb={8}>
                            <FormLabel htmlFor="desc">Workspace Description</FormLabel>
                            <Textarea
                                id="desc"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Write your workspace description here..."
                            />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            isLoading={createWorkspaceMutation.isLoading}
                            loadingText={"Creating"}
                            onClick={() => {
                                createWorkspaceMutation.mutate({
                                    name,
                                    description
                                })
                            }} variant='solid' bgGradient='linear(to-r, orange.500, orange.600)' _hover={{ backgroundColor: "orange.500" }} _active={{ backgroundColor: "orange.500" }}>Create Workspace</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default Workspaces