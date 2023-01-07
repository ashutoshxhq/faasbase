import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Container, FormControl, FormLabel, Input, Stack, Text, Textarea, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteFunction, getFunction, updateFunction } from '../../../../../api/functions';
import { deleteTable, getTable, updateTable } from '../../../../../api/databases';
import { useRecoilState } from 'recoil';
import { currentWorkspaceState } from '../../../../../store/workspaces';

const TableSettings = (props: any) => {
  const [currentWorkspace,] = useRecoilState(currentWorkspaceState);
  const { databaseId, tableId } = useParams();
  const [tableName, setTableName] = useState("");
  const [tableDescription, setTableDescription] = useState("");
  const [tableReadme, setTableReadme] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast()
  const cancelRef = React.useRef<any>();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient()
  const query = useQuery([`databases-${databaseId}-tables-${tableId}`, { getAccessTokenSilently, databaseId, tableId }], getTable)
  const updateTableMutation = useMutation((data: any) => updateTable(data, getAccessTokenSilently), {
    onSuccess: () => {
      queryClient.invalidateQueries([`databases-${databaseId}-tables-${tableId}`])
      queryClient.invalidateQueries([`databases-${databaseId}-tables`])
      toast({
        title: "Success",
        description: "Table updated successfully",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    },

    onError: () => {
      toast({
        title: "Failed",
        description: "Unable to update table",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    }
  })

  const deleteTableMutation = useMutation(() => deleteTable(databaseId || "", tableId || "", getAccessTokenSilently), {
    onSuccess: () => {
      queryClient.invalidateQueries([`databases-${databaseId}-tables`])
      toast({
        title: "Success",
        description: "Table deleted successfully",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      navigate(`/workspaces/${currentWorkspace?.name}/databases/${databaseId}`)
    },

    onError: () => {
      toast({
        title: "Failed",
        description: "Unable to delete table",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    }
  })

  useEffect(() => {
    if (query.data?.data) {
      setTableName(query.data?.data?.data?.name || "")
      setTableDescription(query.data?.data?.data?.description || "")
      setTableReadme(query.data?.data?.data?.readme || "")
    }
  }, [query.data])


  return (
    <>
      <Box as="section">
        <Container px={0} maxW={"8xl"}>
          <Box
            bg={"#1e1e1e"}
            boxShadow={useColorModeValue("sm", "sm-dark")}
            borderRadius="lg"
            p={{ base: "4", md: "6" }}
          >
            <Text mb={6} fontWeight="semibold" fontSize={"xl"}>Update Table Details</Text>
            <FormControl mb={8}>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                id="name"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                type="text"
                autoComplete='off'
              />
            </FormControl>

            <FormControl mb={8}>
              <FormLabel htmlFor="description">Description</FormLabel>
              <Textarea
                id="description"
                value={tableDescription}
                onChange={(e) => setTableDescription(e.target.value)}
              />
            </FormControl>
            <FormControl mb={8}>
              <FormLabel htmlFor="readme">Readme</FormLabel>
              <Textarea
                id="readme"
                value={tableReadme}
                onChange={(e) => setTableReadme(e.target.value)}
              />
            </FormControl>

            <Box display={"flex"} justifyContent="left" mt={8}>
              <Button
                variant="solid"
                bgGradient='linear(to-r, orange.500, orange.600)'
                _hover={{ backgroundColor: "orange.500" }}
                _active={{ backgroundColor: "orange.500" }}
                onClick={() => {
                  updateTableMutation.mutate({
                    name: tableName,
                    description: tableDescription,
                    readme: tableReadme,
                    database_id: databaseId,
                    table_id: tableId,
                  })
                }}

                isLoading={updateTableMutation.isLoading}
                loadingText="Updating"
              >
                Update Table
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box as="section" my={6}>
        <Container px={0} maxW={"8xl"}>
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
                  Delete Table from your current Database
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
                  Delete Table
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
              Delete Table
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this table ?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                isLoading={deleteTableMutation.isLoading}
                loadingText={"Deleting"}
                bg={"red.500"}
                _hover={{ backgroundColor: "red.600" }}
                _active={{ backgroundColor: "red.600" }}
                onClick={() => {
                  deleteTableMutation.mutate()
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>

  )
}

export default TableSettings