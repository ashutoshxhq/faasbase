import { useAuth0 } from '@auth0/auth0-react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Badge,
  Box,
  Button,
  Checkbox,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  TableProps,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { AsyncSelect } from 'chakra-react-select';
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { IoArrowDown } from 'react-icons/io5'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { createUser, deleteUser, getUsers, getUsersByQuery, updateUser } from '../../../api/users';
import { createWorkspaceMember, getCurrentWorkspaceMembers, updateWorkspaceMember } from '../../../api/workspaces';
import { useRecoilState } from 'recoil';
import { currentWorkspaceState } from '../../../store/workspaces';
import { useParams } from 'react-router-dom';

const TeamMembers = () => {
  const { getAccessTokenSilently, getIdTokenClaims, user } = useAuth0();
  const toast = useToast();
  const [currentWorkspace,] = useRecoilState(currentWorkspaceState);
  const workspaceMembersQuery = useQuery([`workspace-members`, { getAccessTokenSilently, currentWorkspace }], getCurrentWorkspaceMembers)
  const queryClient = useQueryClient()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();
  const cancelRef = React.useRef<any>();
  const [selectedUser, setSelectedUser] = useState({});

  const mutation = useMutation((id: any) => deleteUser(id, getAccessTokenSilently), {
    onSuccess: () => {
      queryClient.invalidateQueries([`users`])
      toast({
        title: "Success",
        description: "User deleted successfully",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      onDeleteModalClose()
    },

    onError: () => {
      toast({
        title: "Failed",
        description: "Unable to delete user",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      onDeleteModalClose()
    }
  })

  return (
    <Box>
      <InviteUser isOpen={isOpen} onClose={onClose} />
      <UpdateWorkspaceMember user={selectedUser} isOpen={isUpdateOpen} onClose={onUpdateClose} />
      <Container maxW={"8xl"} px={0}>
        <Box
          bg={"#1e1e1e"}
          boxShadow={useColorModeValue("sm", "sm-dark")}
          borderRadius="lg"
          pb={8}
        >
          <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} p={6}>
            <Text fontSize={"xl"}> Workspace Members </Text>
            <Button
              variant="solid"
              bgGradient='linear(to-r, orange.500, orange.600)'
              _hover={{ backgroundColor: "orange.500" }}
              _active={{ backgroundColor: "orange.500" }}
              onClick={onOpen}
            >
              Invite New User
            </Button>
          </Box>
          <Table bg={"#1e1e1e"} borderColor="whiteAlpha.200" borderRadius="lg">
            <Thead bg={"#1e1e1e"}>
              <Tr borderRadius="lg">
                <Th bg={"whiteAlpha.200"} borderColor="whiteAlpha.200" >
                  <Text>NAME</Text>
                </Th>
                <Th bg={"whiteAlpha.200"} borderColor="whiteAlpha.200" >EMAIL</Th>
                <Th bg={"whiteAlpha.200"} borderColor="whiteAlpha.200" >ROLE</Th>
                <Th bg={"whiteAlpha.200"} borderColor="whiteAlpha.200" >ACTIONS</Th>
              </Tr>
            </Thead>
            <Tbody>
              {workspaceMembersQuery.data?.data?.data.map((member: any) => (
                <Tr key={member.id}>
                  <Td borderColor="whiteAlpha.200" >
                    <HStack spacing="3">
                      <Avatar name={member.firstname} boxSize="8" />
                      <Box>
                        <Text fontWeight="medium">{member.firstname} {member.lastname}</Text>
                      </Box>
                    </HStack>
                  </Td>
                  <Td borderColor="whiteAlpha.200" >
                    <Text color="muted">{member.email}</Text>
                  </Td>
                  <Td borderColor="whiteAlpha.200" >
                    <Badge size="sm" colorScheme={'orange'}>
                      {member.role === "OWNER" ? "Owner" : null}
                      {member.role === "ADMIN" ? "Admin" : null}
                      {member.role === "MEMBER" ? "Member" : null}
                    </Badge>
                  </Td>

                  <Td borderColor="whiteAlpha.200" >
                    <HStack spacing="1">
                      {member.idp_user_id !== user?.sub ? <>
                        <IconButton
                          icon={<FiTrash2 fontSize="1.25rem" />}
                          variant="ghost"
                          _hover={{ backgroundColor: "whiteAlpha.200" }} _active={{ backgroundColor: "whiteAlpha.200" }}
                          aria-label="Remove Member"
                          onClick={() => {
                            setSelectedUser(member)
                            onDeleteModalOpen()
                          }}
                        />
                        <IconButton
                          icon={<FiEdit2 fontSize="1.25rem" />}
                          variant="ghost"
                          _hover={{ backgroundColor: "whiteAlpha.200" }} _active={{ backgroundColor: "whiteAlpha.200" }}
                          aria-label="Chnage Permission"
                          onClick={() => {
                            setSelectedUser(member)
                            onUpdateOpen()
                          }}
                        />
                      </> : null}


                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Container>

      <AlertDialog
        isOpen={isDeleteModalOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteModalClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg={"#1e1e1e"}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Remove User
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to remove user from workspace ?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteModalClose}>
                Cancel
              </Button>
              <Button
                bg={"red.500"}
                _hover={{ backgroundColor: "red.600" }}
                _active={{ backgroundColor: "red.600" }}
                isLoading={mutation.isLoading}
                loadingText={"Deleting"}
                onClick={() => {
                  mutation.mutate(selectedUser)
                }}
                ml={3}
              >
                Remove
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

    </Box>
  )
}

export default TeamMembers



interface InviteUserProp {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteUser(props: InviteUserProp) {
  const toast = useToast();
  const [currentWorkspace,] = useRecoilState(currentWorkspaceState);
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");

  const queryClient = useQueryClient()
  const { getAccessTokenSilently } = useAuth0();

  const mutation = useMutation((data: any) => createWorkspaceMember(data, getAccessTokenSilently), {
    onSuccess: () => {
      queryClient.invalidateQueries([`workspace-members`])
      toast({
        title: "Success",
        description: "User invited successfully",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      setRole("")
      setUserId("")
      props.onClose()
    },

    onError: () => {
      toast({
        title: "Failed",
        description: "Unable to invite user",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    }
  })


  const loadOptions = (inputValue: string) => {
    let getUsers = async (inputValue: string) => {
      let data = await getUsersByQuery(inputValue, getAccessTokenSilently);
      return data.data.data.map((user: any) => ({
        value: user.id,
        label: user.firstname + " " + user.lastname + "(" + user.email + ")"
      }))
    }

    return getUsers(inputValue)
  }



  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose} size={"2xl"}>
        <ModalOverlay />
        <ModalContent bg={"#1e1e1e"}>
          <ModalHeader>Invite User</ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <FormControl isRequired>
              <FormLabel htmlFor="role">User</FormLabel>
              <AsyncSelect cacheOptions loadOptions={loadOptions} colorScheme="orange" isClearable={true} />

            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel htmlFor="role">Role</FormLabel>
              <Select id="role" border={"2px"} value={role} onChange={(e) => setRole(e.target.value)} placeholder='Select role' isRequired>
                <option value='OWNER'>Owner</option>
                <option value='ADMIN'>Admin</option>
                <option value='MEMBER'>Member</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant='solid' colorScheme={"gray"} mr={3} onClick={() => props?.onClose()}>
              Cancel
            </Button>
            <Button
              isLoading={mutation.isLoading}
              loadingText={"Updating"}
              onClick={() => {
                mutation.mutate({
                  role,
                  user_id: userId,
                  workspace_id: currentWorkspace?.id
                })
              }}
              variant="solid"
              bgGradient='linear(to-r, orange.500, orange.600)'
              _hover={{ backgroundColor: "orange.500" }}
              _active={{ backgroundColor: "orange.500" }}
            >
              Invite User
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}




interface UpdateWorkspaceMemberProp {
  user: any;
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateWorkspaceMember(props: UpdateWorkspaceMemberProp) {
  const toast = useToast();
  const [role, setRole] = useState("");
  const queryClient = useQueryClient()
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    setRole(props.user.role)
  }, [props.user])

  const mutation = useMutation(({ id, data }: { id: string, data: any }) => updateWorkspaceMember(id, data, getAccessTokenSilently), {
    onSuccess: () => {
      queryClient.invalidateQueries([`workspace-members`])
      toast({
        title: "Success",
        description: "Role updated successfully",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      props.onClose()
      setRole("")
    },

    onError: () => {
      toast({
        title: "Failed",
        description: "Unable to update role",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    }
  })

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent bg={"#1e1e1e"}>
          <ModalHeader>Update Role</ModalHeader>
          <ModalCloseButton />
          <ModalBody py={4}>

            <FormControl isRequired>
              <FormLabel htmlFor="role">Role</FormLabel>
              <Select id="role" border={"2px"} value={role} onChange={(e) => setRole(e.target.value)} placeholder='Select role' isRequired>
                <option value='OWNER'>Owner</option>
                <option value='ADMIN'>Admin</option>
                <option value='MEMBER'>Member</option>
              </Select>
            </FormControl>

          </ModalBody>

          <ModalFooter>
            <Button variant='solid' colorScheme={"gray"} mr={3} onClick={() => props?.onClose()}>
              Cancel
            </Button>
            <Button
              isLoading={mutation.isLoading}
              loadingText={"Updating"}
              onClick={() => {
                mutation.mutate({
                  id: props.user?.id,
                  data: {
                    role
                  }
                })
              }}
              variant="solid"
              bgGradient='linear(to-r, orange.500, orange.600)'
              _hover={{ backgroundColor: "orange.500" }}
              _active={{ backgroundColor: "orange.500" }}
            >
              Update User
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}





