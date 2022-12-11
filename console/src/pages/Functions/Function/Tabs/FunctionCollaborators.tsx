import { useAuth0 } from '@auth0/auth0-react';
import { Avatar, Badge, Box, Button, calc, Container, HStack, Icon, IconButton, Image, Link, Menu, MenuButton, MenuItem, MenuList, Skeleton, Stack, Table, Tag, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { FiCommand, FiEdit2, FiMoreVertical, FiTrash2 } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { deleteCollaboratorFunction, getCollaborators } from '../../../../api/functions';
import { AddCollaborator } from './AddCollaborator';
import { EditCollaborator } from './EditCollaborator';

const FunctionCollaborators = () => {
  const toast = useToast()
  const { functionId } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCollaborator, setSelectedCollaborator] = useState({})
  const { isOpen: editIsOpen, onOpen: editOnOpen, onClose: editOnClose } = useDisclosure();
  const query = useQuery([`function-${functionId}-collaborators`, { getAccessTokenSilently, functionId }], getCollaborators);
  const queryClient = useQueryClient();

  const deleteCollaboratorMutation = useMutation((collaboratorId: string) => deleteCollaboratorFunction(functionId || "", collaboratorId, getAccessTokenSilently), {
    onSuccess: () => {
      queryClient.invalidateQueries([`function-${functionId}-collaborators`])
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
      <AddCollaborator isOpen={isOpen} onClose={onClose} />
      <EditCollaborator isOpen={editIsOpen} onClose={editOnClose} collaborator={selectedCollaborator} />

      <Container
        as='section'
        display={"flex"}
        justifyContent={"center"}
        alignContent={"start"}
        flexWrap={"wrap"}
        px={0} maxW={"full"}
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

export default FunctionCollaborators