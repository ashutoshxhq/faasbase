import { useAuth0 } from '@auth0/auth0-react'
import { Avatar, Badge, Box, Button, Container, FormControl, FormLabel, HStack, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { useParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { createApplicationCollaborator, deleteApplicationCollaborator, getApplicationCollaborators, updateApplicationCollaborator } from '../../../../api/applications'
import { getCurrentWorkspaceMembers } from '../../../../api/workspaces'
import { currentWorkspaceState } from '../../../../store/workspaces'

export const ApplicationCollaborator = () => {
    const toast = useToast()
    const { applicationId } = useParams();
    const { getAccessTokenSilently } = useAuth0();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedCollaborator, setSelectedCollaborator] = useState({})
    const { isOpen: editIsOpen, onOpen: editOnOpen, onClose: editOnClose } = useDisclosure();
    const query = useQuery([`application-${applicationId}-collaborators`, { getAccessTokenSilently, applicationId }], getApplicationCollaborators);
    const queryClient = useQueryClient();

    const deleteCollaboratorMutation = useMutation((collaboratorId: string) => deleteApplicationCollaborator(applicationId || "", collaboratorId, getAccessTokenSilently), {
        onSuccess: () => {
            queryClient.invalidateQueries([`application-${applicationId}-collaborators`])
            toast({
                title: "Success",
                description: "Collaborator deleted successfully",
                status: "success",
                position: "bottom-right",
                duration: 5000,
                isClosable: true,
            });
        },
        onError: () => {
            toast({
                title: "Failed",
                description: "Unable to delete Collaborator",
                status: "error",
                position: "bottom-right",
                duration: 5000,
                isClosable: true,
            });
        }
    })

    return (
        <Box as="section">
            <AddApplicationCollaborator isOpen={isOpen} onClose={onClose} />
            <EditApplicationCollaborator isOpen={editIsOpen} onClose={editOnClose} collaborator={selectedCollaborator} />

            <Container
                as='section'
                display={"flex"}
                justifyContent={"center"}
                alignContent={"start"}
                flexWrap={"wrap"}
                px={0} maxW={"8xl"}
                gap={"30px"}
            >



                <Box
                    bg={"#1e1e1e"}
                    boxShadow={useColorModeValue("sm", "sm-dark")}
                    borderRadius="lg"
                    pb={8}
                    flex={1}
                >
                    <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} p={6}>
                        <Text fontSize="xl" fontWeight="medium">Manage Collaborators</Text>

                        <Button
                            variant="solid"
                            bgGradient='linear(to-r, orange.500, orange.600)'
                            _hover={{ backgroundColor: "orange.500" }}
                            _active={{ backgroundColor: "orange.500" }}
                            onClick={onOpen}
                        >
                            Add new Collaborator
                        </Button>
                    </Box>
                    <Table bg={"#1e1e1e"} borderColor="whiteAlpha.200" borderRadius="lg">
                        <Thead bg={"#1e1e1e"}>
                            <Tr borderRadius="lg">
                                <Th bg={"whiteAlpha.200"} borderColor="whiteAlpha.200" >
                                    <Text>NAME</Text>
                                </Th>
                                <Th bg={"whiteAlpha.200"} borderColor="whiteAlpha.200" >EMAIL</Th>
                                <Th bg={"whiteAlpha.200"} borderColor="whiteAlpha.200" >PERMISSION</Th>
                                <Th bg={"whiteAlpha.200"} borderColor="whiteAlpha.200" >ACTIONS</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {query.data?.data?.data.map((collaborator: any) => (
                                <Tr key={collaborator.id}>
                                    <Td borderColor="whiteAlpha.200" >
                                        <HStack spacing="3">
                                            <Avatar name={collaborator?.firstname} boxSize="8" />
                                            <Box>
                                                <Text fontWeight="medium">{collaborator?.firstname} {collaborator?.lastname}</Text>
                                            </Box>
                                        </HStack>
                                    </Td>
                                    <Td borderColor="whiteAlpha.200" >
                                        <Text color="muted">{collaborator?.email}</Text>
                                    </Td>
                                    <Td borderColor="whiteAlpha.200" >
                                        <Badge size="sm" colorScheme={'orange'}>
                                            {collaborator?.permission}
                                        </Badge>
                                    </Td>

                                    <Td borderColor="whiteAlpha.200" >
                                        <HStack spacing="1">
                                            <IconButton
                                                icon={<FiTrash2 fontSize="1.25rem" />}
                                                variant="ghost"
                                                _hover={{ backgroundColor: "whiteAlpha.200" }} _active={{ backgroundColor: "whiteAlpha.200" }}
                                                aria-label="Delete member"
                                                onClick={() => {
                                                    deleteCollaboratorMutation.mutate(collaborator?.id)
                                                }}
                                            />
                                            <IconButton
                                                icon={<FiEdit2 fontSize="1.25rem" />}
                                                variant="ghost"
                                                _hover={{ backgroundColor: "whiteAlpha.200" }} _active={{ backgroundColor: "whiteAlpha.200" }}
                                                aria-label="Edit member"
                                                onClick={() => {
                                                    setSelectedCollaborator({ ...collaborator })
                                                    editOnOpen()
                                                }}
                                            />
                                        </HStack>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
            </Container>
        </Box>
    )
}

interface AddApplicationCollaboratorProp {
    isOpen: boolean;
    onClose: () => void;
}

export const AddApplicationCollaborator = (props: AddApplicationCollaboratorProp) => {
    const { applicationId } = useParams();
    const { getAccessTokenSilently, getIdTokenClaims } = useAuth0()
    const toast = useToast();
    const [collaboratorId, setCollaboratorId] = useState("");
    const [permission, setPermission] = useState("");
    const [currentWorkspace,] = useRecoilState(currentWorkspaceState);

    const workspaceMembersQuery = useQuery([`workspace-members`, { getAccessTokenSilently, currentWorkspace }], getCurrentWorkspaceMembers)

    const queryClient = useQueryClient();
    const addCollaboratorMutation = useMutation((data: any) => {
        return createApplicationCollaborator(applicationId || "", data, getAccessTokenSilently)
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries([`application-${applicationId}-collaborators`])
            toast({
                title: "Success",
                description: "Collaborator added successfully",
                status: "success",
                position: "bottom-right",
                duration: 5000,
                isClosable: true,
            });
            props.onClose()
        },

        onError: () => {
            toast({
                title: "Failed",
                description: "Unable to add collaborator",
                status: "error",
                position: "bottom-right",
                duration: 5000,
                isClosable: true,
            });
        }
    })
    return (
        <>
            <Modal isOpen={props.isOpen} onClose={props.onClose} size="lg" >
                <ModalOverlay />
                <ModalContent bg={"#1e1e1e"}>
                    <ModalHeader>Add New Collaborator</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isRequired mb={8}>
                            <FormLabel htmlFor="user">Workspace Member</FormLabel>
                            <Select
                                id="user"
                                border={"2px"}
                                placeholder="User"
                                onChange={(e) => setCollaboratorId(e.target.value)}
                            >
                                {
                                    workspaceMembersQuery?.data?.data?.data.map((u: any, index: number) =>
                                        <option value={u.user_id} key={u.user_id}>{u.firstname}{" "}{u.lastname} </option>
                                    )
                                }
                            </Select>
                        </FormControl>
                        <FormControl isRequired mb={8}>
                            <FormLabel htmlFor="permission">Permissions</FormLabel>
                            <Select
                                id="permission"
                                border={"2px"}
                                placeholder="Permission"
                                onChange={(e) => setPermission(e.target.value)}
                            >
                                <option value="READ">Read</option>
                                <option value="READ_WRITE">Read Write</option>
                                <option value="OWNER">Owner</option>
                            </Select>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant='solid' colorScheme={"gray"} mr={3} onClick={() => props?.onClose()}>
                            Cancel
                        </Button>
                        <Button
                            isLoading={addCollaboratorMutation.isLoading}
                            loadingText={"Creating"}
                            onClick={() => {
                                addCollaboratorMutation.mutate({
                                    permission,
                                    application_id: applicationId,
                                    collaborator_id: collaboratorId
                                })
                            }}
                            variant="solid"
                            bgGradient='linear(to-r, orange.500, orange.600)'
                            _hover={{ backgroundColor: "orange.500" }}
                            _active={{ backgroundColor: "orange.500" }}
                        >
                            Add Collaborator
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

interface EditApplicationCollaboratorProp {
    collaborator: any;
    isOpen: boolean;
    onClose: () => void;
}

export const EditApplicationCollaborator = (props: EditApplicationCollaboratorProp) => {
    const { applicationId } = useParams();
    const { onClose, isOpen, collaborator } = props;
    const { getAccessTokenSilently, getIdTokenClaims } = useAuth0()
    const toast = useToast();
    const [collaboratorId, setCollaboratorId] = useState("");
    const [permission, setPermission] = useState("");
    const queryClient = useQueryClient();

    const editCollaboratorMutation = useMutation((data: any) => {
        return updateApplicationCollaborator(applicationId || "", collaboratorId, data, getAccessTokenSilently)
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries([`application-${applicationId}-collaborators`])
            toast({
                title: "Success",
                description: "Permission updated successfully",
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
                description: "Unable to update permissions",
                status: "error",
                position: "bottom-right",
                duration: 5000,
                isClosable: true,
            });
        }
    })
    useEffect(() => {
        setCollaboratorId(collaborator.id);
        setPermission(collaborator.permission)
    }, [collaborator])
    return (
        <>

            <Modal isOpen={isOpen} onClose={onClose} size="lg" >
                <ModalOverlay />
                <ModalContent bg={"#1e1e1e"}>
                    <ModalHeader>Edit Collaborator Permission</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isRequired mb={8}>
                            <FormLabel htmlFor="permission">Permission</FormLabel>
                            <Select
                                id="permission"
                                border={"2px"}
                                placeholder="Permission"
                                onChange={(e) => setPermission(e.target.value)}
                                value={permission}
                            >
                                <option value="READ">Read</option>
                                <option value="READ_WRITE">Read Write</option>
                                <option value="OWNER">Owner</option>
                            </Select>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant='solid' colorScheme={"gray"} mr={3} onClick={() => onClose()}>
                            Cancel
                        </Button>
                        <Button
                            isLoading={editCollaboratorMutation.isLoading}
                            loadingText={"Updating"}
                            onClick={() => {
                                editCollaboratorMutation.mutate({
                                    application_id: collaborator.application_id,
                                    collaborator_id: collaborator.collaborator_id,
                                    permission
                                })
                            }}
                            variant="solid"
                            bgGradient='linear(to-r, orange.500, orange.600)'
                            _hover={{ backgroundColor: "orange.500" }}
                            _active={{ backgroundColor: "orange.500" }}
                        >
                            Update
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
