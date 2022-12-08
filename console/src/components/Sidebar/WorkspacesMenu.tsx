import { useAuth0 } from '@auth0/auth0-react';
import { Button, FormControl, FormLabel, Icon, Input, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { FiLayers, FiList, FiPlus } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { createWorkspace, getWorkspaces } from '../../api/workspaces';
import { currentWorkspaceState } from '../../store/workspaces';

const WorkspacesMenu = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [currentWorkspace, setCurrentWorkspace] = useRecoilState(currentWorkspaceState);
    const toast = useToast()
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const { getAccessTokenSilently } = useAuth0();
    const query = useQuery(['workspaces', { getAccessTokenSilently }], getWorkspaces)
    const queryClient = useQueryClient()


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
    return (
        <>
            <Menu>
                <Tooltip label={"Workspace -" + currentWorkspace?.name} placement='right'>

                    <MenuButton as={Button} variant="ghost" justifyContent="center" _hover={{ backgroundColor: "whiteAlpha.200" }} _active={{ backgroundColor: "whiteAlpha.200" }} w={12} h={12} borderRadius={"8px"} p={0} mt={4}>
                        <Icon as={FiLayers} boxSize="6" color="subtle" />
                    </MenuButton>
                </Tooltip>
                <MenuList bg={"#1e1e1e"}>
                    <MenuGroup title='WORKSPACES' textColor={"#949494"} >
                        {query.data?.data?.data?.map((workspace: any) => <MenuItem bg={"#1e1e1e"} _hover={{ backgroundColor: "whiteAlpha.200" }} fontSize={"sm"} key={workspace.id} onClick={() => {
                            setCurrentWorkspace(workspace)
                            navigate(`/workspaces/${workspace?.name}/dashboard`)
                        }}>{workspace.name}</MenuItem>)}
                    </MenuGroup>
                    <MenuDivider />
                    <MenuItem bg={"#1e1e1e"} _hover={{ backgroundColor: "whiteAlpha.200" }} fontSize={"sm"} onClick={onOpen} icon={<FiPlus size={"20px"} />}>Create Workspace</MenuItem>
                    <MenuItem bg={"#1e1e1e"} _hover={{ backgroundColor: "whiteAlpha.200" }} fontSize={"sm"} onClick={() => {
                        setCurrentWorkspace(null)
                        navigate("/workspaces")
                    }} icon={<FiList size={"20px"} />}>View All Workspaces</MenuItem>
                </MenuList>
            </Menu>

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
        </>
    )
}

export default WorkspacesMenu