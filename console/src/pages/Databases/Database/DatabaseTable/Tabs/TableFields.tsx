import { useAuth0 } from '@auth0/auth0-react';
import { Avatar, Badge, Box, Button, calc, Container, HStack, Icon, IconButton, Image, Link, Menu, MenuButton, MenuItem, MenuList, Skeleton, Stack, Table, Tag, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { FiCommand, FiEdit2, FiMoreVertical, FiTrash2 } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { deleteField, getFields } from '../../../../../api/databases';
// import { deleteFieldFunction, getFields } from '../../../../api/tables';
import { AddField } from './AddField';
import { EditField } from './EditField';

const TableFields = () => {
  const toast = useToast()
  const { tableId, databaseId } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ selectedField, setSelectedField] = useState({})
  const { isOpen: editIsOpen, onOpen: editOnOpen, onClose: editOnClose } = useDisclosure();
  const queryClient = useQueryClient();
  const query = useQuery([`databases-${databaseId}-tables-${tableId}-fields`, { getAccessTokenSilently, databaseId, tableId }], getFields)
  console.log("fields--------------->",query?.data?.data?.data)
  const deleteFieldMutation = useMutation((fieldId: string) => deleteField(fieldId, databaseId || "", tableId || "", getAccessTokenSilently), {
    onSuccess: () => {
      queryClient.invalidateQueries([`databases-${databaseId}-tables-${tableId}-fields`])
      toast({
        title: "Success",
        description: "Field deleted successfully",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: "Failed",
        description: "Unable to delete field",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    }
  })
  return (
    <Box as="section">
      <AddField isOpen={isOpen} onClose={onClose} />
      <EditField isOpen={editIsOpen} onClose={editOnClose} field={selectedField} />
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
            <Text fontSize="xl" fontWeight="medium">Manage Fields</Text>
            <Button
              variant="solid"
              bgGradient='linear(to-r, orange.500, orange.600)'
              _hover={{ backgroundColor: "orange.500" }}
              _active={{ backgroundColor: "orange.500" }}
              onClick={onOpen}
            >
              Add new Field
            </Button>
          </Box>
          <Table bg={"#1e1e1e"} borderColor="whiteAlpha.200" borderRadius="lg">
            <Thead bg={"#1e1e1e"}>
              <Tr borderRadius="lg">
                <Th bg={"whiteAlpha.200"} borderColor="whiteAlpha.200" >NAME</Th>
                <Th bg={"whiteAlpha.200"} borderColor="whiteAlpha.200" >DATA TYPE</Th>
                <Th bg={"whiteAlpha.200"} borderColor="whiteAlpha.200" >DEFAULT VALUE</Th>
                <Th bg={"whiteAlpha.200"} borderColor="whiteAlpha.200" >VISIBILITY</Th>
                <Th bg={"whiteAlpha.200"} borderColor="whiteAlpha.200" >REFERENCE TABLE</Th>
                <Th bg={"whiteAlpha.200"} borderColor="whiteAlpha.200" >REFERENCE FIELD</Th>
                <Th bg={"whiteAlpha.200"} borderColor="whiteAlpha.200" >ACTIONS</Th>
              </Tr>
            </Thead>
            <Tbody>
              {query?.data?.data?.data?.map((field: any) => (
                <Tr key={field.id}>
                  <Td borderColor="whiteAlpha.200" >
                    <Text color="muted">{field?.name}</Text>
                  </Td>
                  
                  <Td borderColor="whiteAlpha.200" >
                    <Badge size="sm" colorScheme={'orange'}>
                      {field?.data_type}
                    </Badge>
                  </Td>
                  <Td borderColor="whiteAlpha.200" >
                    <Text color="muted">{field?.default_value ?.trim() === "" ? "None":field?.default_value}</Text>
                  </Td>
                  <Td borderColor="whiteAlpha.200" >
                    <Badge size="sm" colorScheme={'orange'}>
                      {field?.visibility}
                    </Badge>
                  </Td>
                  <Td borderColor="whiteAlpha.200" >
                    <Text color="muted">{(field?.relationship_config?.reference_table == null) ? "NULL":field.relationship_config?.reference_table}</Text>
                  </Td>
                  <Td borderColor="whiteAlpha.200" >
                    <Text color="muted">{(field?.relationship_config?.reference_field == null) ? "NULL":field.relationship_config?.reference_field}</Text>
                  </Td>
                  <Td borderColor="whiteAlpha.200" >
                    <HStack spacing="1">
                      <IconButton
                        icon={<FiTrash2 fontSize="1.25rem" />}
                        variant="ghost"
                        _hover={{ backgroundColor: "whiteAlpha.200" }} _active={{ backgroundColor: "whiteAlpha.200" }}
                        aria-label="Delete member"
                        onClick={() => {
                          deleteFieldMutation.mutate(field?.id)
                        }}
                      />
                      <IconButton
                        icon={<FiEdit2 fontSize="1.25rem" />}
                        variant="ghost"
                        _hover={{ backgroundColor: "whiteAlpha.200" }} _active={{ backgroundColor: "whiteAlpha.200" }}
                        aria-label="Edit member"
                        onClick={() => {
                          setSelectedField({ ...field })
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

export default TableFields