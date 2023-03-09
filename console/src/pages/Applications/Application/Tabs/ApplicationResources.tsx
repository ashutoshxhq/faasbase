import { useAuth0 } from '@auth0/auth0-react';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Container, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, FormControl, FormLabel, Icon, IconButton, Image, Input, Link, Menu, MenuButton, MenuItem, MenuList, Select, Skeleton, Stack, Switch, Tag, Text, Textarea, useDisclosure, useToast } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { FiCommand, FiSettings } from 'react-icons/fi';
import { MdClose } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { createApplicationResource, deleteApplicationResource, getApplicationResources, updateApplicationResource } from '../../../../api/applications';
import { getFunctions } from '../../../../api/functions';
import { currentWorkspaceState } from '../../../../store/workspaces';

function ApplicationResources() {

  const toast = useToast()
  const { applicationId } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedResource, setSelectedResource] = useState<any>({})
  const { isOpen: editIsOpen, onOpen: editOnOpen, onClose: editOnClose } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();

  const cancelRef = useRef<any>();
  // const query = useQuery([`application-${applicationId}-resources`, { getAccessTokenSilently, applicationId }], getApplicationResources);
  const queryClient = useQueryClient();
  const query = useQuery([`applicationResources`, { getAccessTokenSilently, applicationId }], getApplicationResources)
  const mutation = useMutation((id: any) => deleteApplicationResource(applicationId || "", id, getAccessTokenSilently), {
    onSuccess: () => {
      queryClient.invalidateQueries([`applicationResources`])
      toast({
        title: "Success",
        description: "Resource deleted successfully",
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
        description: "Unable to delete resource",
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
      <CreateApplicationResource isOpen={isOpen} onClose={onClose} />
      <UpdateteApplicationResource isOpen={editIsOpen} onClose={editOnClose} data={selectedResource} />

      <Container
        display={"flex"}
        justifyContent={"center"}
        alignContent={"start"}
        flexWrap={"wrap"}
        px={0}
        maxW={"full"}
        gap={"30px"}
      >
        <Box display={"flex"} flex={1} justifyContent="space-between" alignItems={"center"}>
          <Box>
            <Text fontSize="xl" fontWeight="medium">Manage Resources</Text>
            <Text color="muted" fontSize="sm">
              Add and Configure application resources here
            </Text>
          </Box>
          <Button
            variant="solid"
            bgGradient='linear(to-r, orange.500, orange.600)'
            _hover={{ backgroundColor: "orange.500" }}
            _active={{ backgroundColor: "orange.500" }}
            onClick={onOpen}
            loadingText="Updating"
          >
            Add Resource
          </Button>
        </Box>

        {query.data?.data.data?.map((resource: any, index: number) => (
          <Box
            key={index}
            as="section"
            borderRadius={8}
            bg={"#1e1e1e"}
            boxShadow={"2xl"}
            border={"solid 0px #424242fd"}
            px={4}
            py={4}
            width={"calc(100%)"}
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
                spacing={'6'}
              >
                <Box bg={"whiteAlpha.200"} p={2} borderRadius={6}>
                  <FiCommand size={24} />
                </Box>
                <Box display={"flex"} flexDirection='column' justifyContent={"center"}>
                  <Text fontSize="md" fontWeight="medium">
                    {resource?.config?.method} : {resource?.config?.endpoint}
                  </Text>
                </Box>

              </Stack>
              <Stack direction="row" spacing={4}>
                <Tag>fn: {resource?.resource_name}</Tag>
                <Tag>
                  {resource?.resource_type === "HTTP_ENDPOINT" ? "HTTP Endpoint" : null}
                </Tag>
                {resource?.config?.version ? <Tag>v{resource?.config?.version}</Tag> : null}

                <Box display={"flex"}>
                  <IconButton
                    _hover={{ backgroundColor: "whiteAlpha.200" }}
                    _active={{ backgroundColor: "whiteAlpha.200" }}
                    aria-label="Options"
                    onClick={() => {
                      setSelectedResource(resource)
                      editOnOpen()
                    }}
                    icon={<FiSettings size={18} />}
                    variant="ghost"
                  />
                  <IconButton
                    _hover={{ backgroundColor: "whiteAlpha.200" }}
                    _active={{ backgroundColor: "whiteAlpha.200" }}
                    aria-label="Options"
                    onClick={() => {
                      setSelectedResource(resource)
                      onDeleteModalOpen()
                    }}
                    icon={<MdClose size={22} />}
                    variant="ghost"
                  />

                </Box>
              </Stack>
            </Stack>
          </Box>))
        }
      </Container>
      <AlertDialog
        isOpen={isDeleteModalOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteModalClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg={"#1e1e1e"}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Resource
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this resource ?
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
                  mutation.mutate(selectedResource?.id)
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

export default ApplicationResources




interface CreateApplicationResourceProp {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateApplicationResource(props: CreateApplicationResourceProp) {
  const { applicationId } = useParams();
  const toast = useToast();
  const [functionId, setFunctionId] = useState("")
  const [version, setVersion] = useState("")
  const [resourceType, setResourceType] = useState("")
  const [endpoint, setEndpoint] = useState("")
  const [method, setMethod] = useState("")
  const [isAuthEnabled, setIsAuthEnabled] = useState(true)

  const { getAccessTokenSilently, getIdTokenClaims } = useAuth0();

  const [currentWorkspace,] = useRecoilState(currentWorkspaceState);
  const queryClient = useQueryClient()
  const functionsQuery = useQuery([`functions`, { getAccessTokenSilently, currentWorkspace }], getFunctions)

  const createApplicationResourceMutation = useMutation((data: any) => createApplicationResource(applicationId || "", data, getAccessTokenSilently), {
    onSuccess: () => {
      queryClient.invalidateQueries([`applicationResources`])
      toast({
        title: "Success",
        description: "Resource created successfully",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      props.onClose()
      setFunctionId("")
      setResourceType("")
      setVersion("")
      setEndpoint("")
      setMethod("")
    },

    onError: () => {
      toast({
        title: "Failed",
        description: "Unable to create resource",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    }
  })

  return (
    <>
      <Drawer isOpen={props.isOpen} onClose={props.onClose} size="lg" >
        <DrawerOverlay />
        <DrawerContent mx={"23px"} my={"53px"} borderRadius={"8px"} bg={"#1e1e1e"} overflowY={"scroll"}>
          <DrawerCloseButton />
          <DrawerHeader data-tauri-drag-region>Add New Resource</DrawerHeader>
          <DrawerBody>
            <FormControl isRequired mt={6}>
              <FormLabel htmlFor="resource-type">Trigger Type</FormLabel>
              <Select placeholder='Select trigger type' isRequired border={"2px"} value={resourceType} onChange={(e) => setResourceType(e.target.value)}>
                <option value="HTTP_ENDPOINT"> HTTP Endpoint</option>
              </Select>
            </FormControl>

            <Box display={"flex"} justifyContent="space-between" alignItems={"center"} gap={4} mt={10}>

              <Box flex={1}>
                <FormControl isRequired>
                  <FormLabel htmlFor="endpoint">Endpoint</FormLabel>
                  <Input
                    id="endpoint"
                    isRequired
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                  />
                </FormControl>
              </Box>
              <Box w={"30%"}>
                <FormControl isRequired>
                  <FormLabel htmlFor="method">Method</FormLabel>
                  <Select placeholder='Select method' isRequired border={"2px"} value={method} onChange={(e) => setMethod(e.target.value)}>
                    <option value="GET"> GET</option>
                    <option value="POST"> POST</option>
                    <option value="PATCH"> PATCH</option>
                    <option value="DELETE"> DELETE</option>
                    <option value="HEAD"> HEAD</option>
                  </Select>
                </FormControl>
              </Box>
            </Box>
            <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} mt={10} gap={4}>
              <Box flex={1}>
                <FormControl isRequired>
                  <FormLabel htmlFor="function">Function</FormLabel>
                  <Select placeholder='Select Function' isRequired border={"2px"} value={functionId} onChange={(e) => setFunctionId(e.target.value)}>
                    {functionsQuery.data?.data.data?.map((functionData: any, index: number) => <option key={index} value={functionData?.id}> {functionData?.name}</option>)}
                  </Select>
                </FormControl>

              </Box>
              <Box w={"30%"}>
                <FormControl isRequired>
                  <FormLabel htmlFor="version">Version</FormLabel>
                  <Select placeholder='Select version' isRequired border={"2px"} value={version} onChange={(e) => setVersion(e.target.value)}>
                    {functionsQuery.data?.data.data?.find((functionData: any) => functionData.id === functionId)?.builds?.map((build: any) => <option value={build?.version}>{build?.version}</option>)}
                  </Select>
                </FormControl>

              </Box>
            </Box>

            <Box mt={10}>
              <FormControl maxW={"300px"}>
                <FormLabel htmlFor={"jwt"}>Enable Authorization ?</FormLabel>
                <Switch my="4px" id="jwt" size='lg' isChecked={isAuthEnabled || false} onChange={(e) => setIsAuthEnabled(!isAuthEnabled)} sx={{ 'span.chakra-switch__track[data-checked]': { backgroundColor: 'orange.500' } }} colorScheme='orange' />
              </FormControl>
            </Box>


          </DrawerBody>
          <DrawerFooter>
            <Button variant='solid' colorScheme={"gray"} mr={3} onClick={() => props?.onClose()}>
              Cancel
            </Button>
            <Button

              isLoading={createApplicationResourceMutation.isLoading}
              loadingText={"Adding"}
              onClick={async () => {
                createApplicationResourceMutation.mutate({
                  resource_type: resourceType,
                  config: {
                    version: version,
                    method: method,
                    endpoint: endpoint,
                    is_auth_enabled: isAuthEnabled,
                  },
                  resource_id: functionId,
                  application_id: applicationId,
                })
              }}
              variant="solid"
              bgGradient='linear(to-r, orange.500, orange.600)'
              _hover={{ backgroundColor: "orange.500" }}
              _active={{ backgroundColor: "orange.500" }}
            >
              Add Resource
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}





interface UpdateApplicationResourceProp {
  data: any;
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateteApplicationResource(props: UpdateApplicationResourceProp) {
  const { applicationId } = useParams();
  const toast = useToast();
  const [functionId, setFunctionId] = useState("")
  const [version, setVersion] = useState("")
  const [resourceType, setResourceType] = useState("")
  const [endpoint, setEndpoint] = useState("")
  const [method, setMethod] = useState("")
  const [isAuthEnabled, setIsAuthEnabled] = useState(true)

  const { getAccessTokenSilently, getIdTokenClaims } = useAuth0();

  const [currentWorkspace,] = useRecoilState(currentWorkspaceState);
  const queryClient = useQueryClient()
  const functionsQuery = useQuery([`functions`, { getAccessTokenSilently, currentWorkspace }], getFunctions)

  const updateApplicationResourceMutation = useMutation((data: any) => updateApplicationResource(applicationId || "", props.data.id, data, getAccessTokenSilently), {
    onSuccess: () => {
      queryClient.invalidateQueries([`applicationResources`])
      toast({
        title: "Success",
        description: "Resource updated successfully",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      props.onClose()
      setFunctionId("")
      setResourceType("")
      setVersion("")
      setEndpoint("")
      setMethod("")
    },

    onError: () => {
      toast({
        title: "Failed",
        description: "Unable to update resource",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    }
  })

  useEffect(() => {
    setFunctionId(props.data.resource_id || "")
    setResourceType(props.data.resource_type || "")
    setVersion(props?.data?.config?.version || "")
    setEndpoint(props?.data?.config?.endpoint || "")
    setMethod(props.data?.config?.method || "")
    setIsAuthEnabled(props.data?.config?.isAuthEnabled?true:false)
  }, [props.data])


  return (
    <>
      <Drawer isOpen={props.isOpen} onClose={props.onClose} size="lg" >
        <DrawerOverlay />
        <DrawerContent mx={"23px"} my={"53px"} borderRadius={"8px"} bg={"#1e1e1e"} overflowY={"scroll"}>
          <DrawerCloseButton />
          <DrawerHeader data-tauri-drag-region>Configure Resource</DrawerHeader>
          <DrawerBody>
          <FormControl isRequired mt={6}>
              <FormLabel htmlFor="resource-type">Trigger Type</FormLabel>
              <Select placeholder='Select trigger type' isRequired border={"2px"} value={resourceType} onChange={(e) => setResourceType(e.target.value)}>
                <option value="HTTP_ENDPOINT"> HTTP Endpoint</option>
              </Select>
            </FormControl>

            <Box display={"flex"} justifyContent="space-between" alignItems={"center"} gap={4} mt={6}>
              <Box flex={1}>
                <FormControl isRequired mt={4}>
                  <FormLabel htmlFor="endpoint">Endpoint</FormLabel>
                  <Input
                    id="endpoint"
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                  />
                </FormControl>
              </Box>
              <Box w={"30%"}>
                <FormControl isRequired mt={4}>
                  <FormLabel htmlFor="method">Method</FormLabel>
                  <Select placeholder='Select method' border={"2px"} value={method} onChange={(e) => setMethod(e.target.value)}>
                    <option value="GET"> GET</option>
                    <option value="POST"> POST</option>
                    <option value="PATCH"> PATCH</option>
                    <option value="DELETE"> DELETE</option>
                    <option value="HEAD"> HEAD</option>
                  </Select>
                </FormControl>
              </Box>
            </Box>
            <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} mt={8} gap={4}>
              <Box flex={1}>
                <FormControl isRequired>
                  <FormLabel htmlFor="function">Function</FormLabel>
                  <Select placeholder='Select Function' border={"2px"} value={functionId} onChange={(e) => setFunctionId(e.target.value)}>
                    {functionsQuery.data?.data.data?.map((functionData: any, index: number) => <option key={index} value={functionData?.id}> {functionData?.name}</option>)}
                  </Select>
                </FormControl>

              </Box>
              <Box w={"30%"}>
                <FormControl isRequired>
                  <FormLabel htmlFor="version">Version</FormLabel>
                  <Select placeholder='Select version' border={"2px"} value={version} onChange={(e) => setVersion(e.target.value)}>
                    {functionsQuery.data?.data.data?.find((functionData: any) => functionData.id === functionId)?.builds?.map((build: any) => <option value={build?.version}>{build?.version}</option>)}
                  </Select>
                </FormControl>

              </Box>
            </Box>

            <Box mt={10}>
              <FormControl maxW={"200px"}>
                <FormLabel htmlFor={"jwt"}>Enable Authorization ?</FormLabel>
                <Switch my="4px" id="jwt" size='lg' isChecked={isAuthEnabled} onChange={(e) => setIsAuthEnabled(!isAuthEnabled)} sx={{ 'span.chakra-switch__track[data-checked]': { backgroundColor: 'orange.500' } }} colorScheme='orange' />
              </FormControl>
            </Box>


          </DrawerBody>
          <DrawerFooter>
            <Button variant='solid' colorScheme={"gray"} mr={3} onClick={() => props?.onClose()}>
              Cancel
            </Button>
            <Button

              isLoading={updateApplicationResourceMutation.isLoading}
              loadingText={"Updating"}
              onClick={async () => {
                updateApplicationResourceMutation.mutate({
                  resource_type: resourceType,
                  config: {
                    version: version,
                    method: method,
                    endpoint: endpoint,
                    is_auth_enabled: isAuthEnabled
                  },
                  resource_id: functionId,
                  application_id: applicationId,
                })
              }}
              variant="solid"
              bgGradient='linear(to-r, orange.500, orange.600)'
              _hover={{ backgroundColor: "orange.500" }}
              _active={{ backgroundColor: "orange.500" }}
            >
              Update Resource
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}