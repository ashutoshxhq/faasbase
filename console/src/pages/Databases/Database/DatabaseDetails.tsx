import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Container, FormControl, FormLabel, Input, Skeleton, Stack, Text, Textarea, useColorModeValue, useDisclosure, useToast, Select } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRecoilState } from 'recoil';
import { currentWorkspaceState } from '../../../store/workspaces';
import { deleteDatabase, getDatabase, updateDatabase } from '../../../api/databases';
import { FiDatabase } from 'react-icons/fi';
function DatabaseDetails() {
  const [currentWorkspace,] = useRecoilState(currentWorkspaceState);
  const { databaseId,} = useParams();
  const [databaseName, setDatabaseName] = useState("");
  const [databaseHostname, setDatabaseHostname] = useState("");
  const [databaseUsername, setDatabaseUsername] = useState("");
  const [databasePassword, setDatabasePassword] = useState("");
  const [databasePort, setDatabasePort] = useState("");
  const [databaseType, setDatabaseType] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast()
  const cancelRef = React.useRef<any>();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient()
  const updateDatabaseMutation = useMutation((data: any) => updateDatabase(data, getAccessTokenSilently), {
    onSuccess: () => {
      queryClient.invalidateQueries([`databases-${databaseId}-databases-${databaseId}`])
      queryClient.invalidateQueries([`databases-${databaseId}-databases`])
      toast({
        title: "Success",
        description: "database updated successfully",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    },

    onError: () => {
      toast({
        title: "Failed",
        description: "Unable to update database",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    }
  })

  const deletedatabaseMutation = useMutation(() => deleteDatabase(databaseId || "", getAccessTokenSilently), {
    onSuccess: () => {
      queryClient.invalidateQueries([`databases-${databaseId}`])
      toast({
        title: "Success",
        description: "database deleted successfully",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      navigate(`/workspaces/${currentWorkspace?.name}/databases`)
    },

    onError: () => {
      toast({
        title: "Failed",
        description: "Unable to delete database",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    }
  })
  const database = useQuery(['databases-'+databaseId, { getAccessTokenSilently, databaseId }], getDatabase);

  useEffect(() => {
    if (database.data?.data) {
      setDatabaseName(database.data?.data?.data?.name || "")
      setDatabaseHostname(database.data?.data?.data?.hostname || "")
      setDatabaseUsername(database.data?.data?.data?.username || "")
      setDatabasePassword(database.data?.data?.data?.password || "")
      setDatabasePort(database.data?.data?.data?.port || "")
      setDatabaseType(database.data?.data?.data?.database_type || "")
    }
  }, [database.data])
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
            <Box display="flex" gap={4} justifyContent={"center"} alignItems={"center"}>
              <FiDatabase size={"40px"} />
              {
                database?.isFetched ? (
                <Box>
                  <Text fontSize="2xl" fontWeight="medium">
                    {databaseName}
                  </Text>
                  <Text color="muted" fontSize="sm">
                    {databaseType}
                  </Text>
                </Box>
                ):(
                  <Stack width={"50%"}>
                    <Skeleton startColor='#1e1e1e' endColor='#424242' height='30px' width={"100%"} />
                    <Skeleton startColor='#1e1e1e' endColor='#424242' height='20px' width={"100%"} />
                  </Stack>
                )
              }
            </Box>
          </Stack>
        </Stack>
      </Box>
      <Box mt={"4"} as="section">
        <Container px={0} maxW={"8xl"}>
          <Box
            bg={"#1e1e1e"}
            boxShadow={useColorModeValue("sm", "sm-dark")}
            borderRadius="lg"
            p={{ base: "4", md: "6" }}
          >
            <Text mb={6} fontWeight="semibold" fontSize={"xl"}>Update database Details</Text>
            <Stack direction='row' width={"100%"} spacing="4">
              <Stack width="50%">
                <FormControl isRequired mt={8}>
                  <FormLabel htmlFor="database-name">Database Name</FormLabel>
                  <Input
                    id="database-name"
                    value={databaseName}
                    onChange={(e) => setDatabaseName(e.target.value)}
                  />
                </FormControl>
              </Stack>
              <Stack width={"50%"}> 
                <FormControl isRequired mt={8}>
                  <FormLabel htmlFor="database-hostname">Host Name</FormLabel>
                  <Input
                    id="database-hostname"
                    value={databaseHostname}
                    onChange={(e) => setDatabaseHostname(e.target.value)}
                  />
                </FormControl>
              </Stack>
            </Stack>
            <Stack direction={"row"} width={"100%"} spacing="4">
              <Stack width={"50%"}>
                <FormControl isRequired mt={8}>
                  <FormLabel htmlFor="database-username">Username</FormLabel>
                  <Input
                    id="database-username"
                    value={databaseUsername}
                    onChange={(e) => setDatabaseUsername(e.target.value)}
                  />
                </FormControl>
              </Stack>
              <Stack width={"50%"}>
                <FormControl isRequired mt={8}>
                  <FormLabel htmlFor="database-password">Password</FormLabel>
                  <Input
                    id="database-password"
                    value={databasePassword}
                    onChange={(e) => setDatabasePassword(e.target.value)}
                  />
                </FormControl>
              </Stack>
            </Stack>
            
           
            <Stack direction='row' width={"100%"} spacing="4">
              <Stack width={"50%"}>
                <FormControl isRequired mt={8}>
                  <FormLabel htmlFor="database-port">Port</FormLabel>
                  <Input
                    id="database-port"
                    type="number"
                    value={databasePort}
                    onChange={(e) => setDatabasePort(e.target.value)}
                  />
                </FormControl>
              </Stack> 
              <Stack width={"50%"}>
                <FormControl isRequired mt={8}>
                  <FormLabel htmlFor="database-type">Database Type</FormLabel>
                  <Select
                    id="database-type"
                    onChange={(e) =>setDatabaseType(e.target.value)}
                    value={databaseType}
                  >
                    <option disabled value="">None</option>
                    <option value="MONOGODB">Mongo Db</option>
                    <option value="MYSQL">MySql</option>
                    <option value="POSTGRES">Postgres</option>
                  </Select>
                </FormControl>
              </Stack>
              
            </Stack>
            
            <Box display={"flex"} justifyContent="left" mt={8}>
              <Button
                variant="solid"
                bgGradient='linear(to-r, orange.500, orange.600)'
                _hover={{ backgroundColor: "orange.500" }}
                _active={{ backgroundColor: "orange.500" }}
                onClick={() => {
                  updateDatabaseMutation.mutate({
                    name: databaseName,
                    hostname: databaseHostname,
                    username: databaseUsername,
                    password: databasePassword,
                    port: databasePort,
                    database_type: databaseType,
                    database_id: databaseId,
                  })
                }}

                isLoading={updateDatabaseMutation.isLoading}
                loadingText="Updating"
              >
                Update database
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
                  Delete {databaseName} from your current Workspace
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
                  Delete database
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
              Delete database
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this database ?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                isLoading={deletedatabaseMutation.isLoading}
                loadingText={"Deleting"}
                bg={"red.500"}
                _hover={{ backgroundColor: "red.600" }}
                _active={{ backgroundColor: "red.600" }}
                onClick={() => {
                  deletedatabaseMutation.mutate()
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  )
}

export default DatabaseDetails