import { useAuth0 } from '@auth0/auth0-react'
import { Box, Button, Card, Divider, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, FormControl, FormLabel, IconButton, Input, Link, Menu, MenuButton, MenuItem, MenuList, Stack, Tag, Text, Textarea, useDisclosure, useToast } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { FiGlobe, FiMoreHorizontal, FiPackage, FiPlus } from 'react-icons/fi'
import { NavLink, useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { createApplication, deleteApplication, getApplications } from '../../api/applications'
import { CustomSelect, Option } from '../../components/CustomSelect/CustomSelect'
import { RadioCard, RadioCardGroup } from '../../components/RadioCardGroup/RadioCardGroup'
import { currentWorkspaceState } from '../../store/workspaces'

const Applications = () => {

  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { getAccessTokenSilently } = useAuth0();
  const [currentWorkspace,] = useRecoilState(currentWorkspaceState);
  const navigate = useNavigate()
  const query = useQuery(['applications', { getAccessTokenSilently, currentWorkspace }], getApplications)
  const queryClient = useQueryClient()
  const deleteMutation = useMutation((applicationId: string) => deleteApplication(applicationId, getAccessTokenSilently), {
    onSuccess: () => {
      queryClient.invalidateQueries([`applications`])
      toast({
        title: "Success",
        description: "Application deleted successfully",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    },

    onError: () => {
      toast({
        title: "Failed",
        description: "Unable to delete application",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    }
  })

  useEffect(() => {
    document.title = "Faasbase Console | Applications"
  }, [])


  return (
    <Box height={"calc(100vh - 40px)"} overflowY={"scroll"}>
      <CreateApplication isOpen={isOpen} onClose={onClose} />
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
              <FiPackage size={"40px"} />
              <Box>
                <Text fontSize="2xl" fontWeight="medium">
                  Applications
                </Text>
                <Text color="muted" fontSize="sm">
                  Manage all your applications here
                </Text>
              </Box>
            </Box>
            <Stack direction="row">
              <Button onClick={onOpen} variant="solid" bgGradient='linear(to-r, orange.500, orange.600)' _hover={{ backgroundColor: "orange.500" }} _active={{ backgroundColor: "orange.500" }}>Create New Application</Button>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      <Card bg={"#1e1e1e"} w={"full"} mt={"4"}>
        <Box w={"full"} display="flex" justifyContent={"space-between"} alignItems={"center"} p={4}>
          <Box display="flex" justifyContent={"space-between"} alignItems={"center"} gap={2}>
            <Tag> Filter By</Tag>
            <Tag> <FiPlus /></Tag>
          </Box>

        </Box>
        <Divider  color={"#303030"} />
        <Box display={"flex"} flexDirection={"column"} mb={6}>
          {/* create a list of applications where name if application is in left and some other details like application type, version, stars and forks and three dot menu on the right */}
          {query.data?.data?.data?.map((faasbaseApplication: any, index: number) => (
            <Box display={"flex"} justifyContent={"start"} alignItems={"center"} borderBottom={"solid 1px"} borderColor={"#303030"} _hover={{ backgroundColor: "whiteAlpha.100" }}>
              <Box cursor={"pointer"} onClick={()=>{
                navigate(`/workspaces/${currentWorkspace?.name}/applications/${faasbaseApplication.id}`)
              }} display={"flex"} justifyContent={"start"} flexDirection={"column"} alignItems={"start"} gap={1} py={4} px={8}>
                <Text fontSize={"lg"} fontWeight={"medium"}>{faasbaseApplication.name}</Text>
                <Text fontSize={"xs"} color={"subtle"}>{faasbaseApplication.description}</Text>
              </Box>
              <Box display={"flex"} justifyContent={"end"} alignItems={"center"} flex={1} gap={4} p={4}>
                <Tag py={2} px={4}  letterSpacing={"0.2px"} fontSize={"sm"}>
                  {faasbaseApplication.application_type === "WEB_SERVICE" ? "Custom Web Service" : null}
                  {faasbaseApplication.application_type === "CLOUD_FUNCTION" ? "Cloud Function" : null}
                  {faasbaseApplication.application_type === "DOCKER" ? "Docker" : null}
                  {faasbaseApplication.application_type === "SINGLE_PAGE_APPLICATION" ? "Single Page Application" : null}

                </Tag>
                <Tag py={2} px={4} letterSpacing={"0.2px"} fontSize={"sm"}>
                  {faasbaseApplication.visibility === "PUBLIC" ? "Public" : "Private"}
                </Tag>
                {faasbaseApplication.deployed_version === "" || !faasbaseApplication.deployed_version ? <Tag py={2} px={4}  letterSpacing={"0.2px"} fontSize={"sm"}>No Builds</Tag> : <Tag py={2} px={4} letterSpacing={"0.2px"} fontSize={"sm"}>Version: {faasbaseApplication.deployed_version}</Tag>}
                <Menu size={"2xl"}>
                  <MenuButton
                    color={"whiteAlpha.800"}
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
                      onClick={async () => {
                        deleteMutation.mutate(faasbaseApplication.id)
                      }}
                    >
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Box>
            </Box>
          ))}
        </Box>

      </Card>


      {/* <Box
        display={"flex"}
        justifyContent={"start"}
        alignContent={"start"}
        flexWrap={"wrap"}
        mt={2}
        py={4}
        gap={"20px"}
      >


        {query.data?.data?.data?.map((faasbaseApplication: any, index: number) => (
          <Box
            key={index}
            borderRadius={8}
            bg={"#1e1e1e"}
            boxShadow={"2xl"}
            border={"solid 0px #424242fd"}
            px={8}
            py={6}
            width={"460px"}
            display="flex"
            alignItems={"start"}
            justifyContent={"start"}
            cursor={"pointer"}
            _hover={{ background: "#1e1e1e" }}
          >

            <Link
              to={"/workspaces/" + currentWorkspace?.name + "/applications/" + faasbaseApplication?.id}
              as={NavLink}
              display="flex"
              alignItems={"start"}
              justifyContent={"start"}
              flex={1}
              textDecoration={"none"}
              _hover={{ textDecoration: "none" }}
            >
              <Box
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"start"}
                flex={1}
              >
                <Text fontSize={"md"} fontWeight={"semibold"} color="#e3e3e3" mb={1}>
                  {faasbaseApplication.name}
                </Text>
                <Text fontSize={"sm"} color={"#9d9d9d"} noOfLines={1} mb={2}>
                  {faasbaseApplication.description}
                </Text>
                <Box display={"flex"} gap={2} mt={6}>
                  <Tag letterSpacing={"0.2px"} fontSize={"xs"}>
                    {faasbaseApplication.application_type === "WEB_SERVICE" ? "Custom Web Service" : null}
                    {faasbaseApplication.application_type === "CLOUD_FUNCTION" ? "Cloud Function" : null}
                    {faasbaseApplication.application_type === "DOCKER" ? "Docker" : null}
                    {faasbaseApplication.application_type === "SINGLE_PAGE_APPLICATION" ? "Single Page Application" : null}

                  </Tag>
                  {faasbaseApplication.latest_version === "" || !faasbaseApplication.latest_version ? <Tag letterSpacing={"0.2px"} fontSize={"xs"}>No Builds</Tag> : <Tag letterSpacing={"0.2px"} fontSize={"xs"}>Version: {faasbaseApplication.latest_version}</Tag>}
                </Box>
              </Box>
            </Link>
            <Box ml={4}>
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
                    onClick={async () => {
                      deleteMutation.mutate(faasbaseApplication.id)
                    }}
                  >
                    Delete
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </Box>
        )
        )}

      </Box> */}



    </Box>
  )
}

export default Applications



interface CreateApplicationProp {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateApplication(props: CreateApplicationProp) {
  const toast = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC")
  const [applicationType, setApplicationType] = useState("WEB_SERVICE");
  const { getAccessTokenSilently, getIdTokenClaims } = useAuth0();
  const [currentWorkspace,] = useRecoilState(currentWorkspaceState);
  const queryClient = useQueryClient()

  const createApplicationMutation = useMutation((data: any) => createApplication(data, getAccessTokenSilently), {
    onSuccess: () => {
      queryClient.invalidateQueries([`applications`])
      toast({
        title: "Success",
        description: "Application created successfully",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      props.onClose()
      setName("")
      setDescription("")
      setApplicationType("WEB_SERVICE")
    },

    onError: () => {
      toast({
        title: "Failed",
        description: "Unable to create application",
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
          <DrawerHeader data-tauri-drag-region>Create New Application</DrawerHeader>
          <DrawerBody>
            <FormControl isRequired mt={4}>
              <FormLabel htmlFor="application-name">Application Name</FormLabel>
              <Input
                id="application-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired mt={8}>
              <FormLabel htmlFor="application-desc">Application Description</FormLabel>
              <Textarea
                id="application-desc"
                height={"180px"}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write your application description here..."
              />
            </FormControl>

            <FormControl isRequired mt={8}>
              <FormLabel htmlFor="application_type" fontSize={"xl"} mb="4">Application Type</FormLabel>
              <RadioCardGroup id="application_type" value={applicationType} onChange={(value) => setApplicationType(value)}>

                <RadioCard value={"WEB_SERVICE"}>
                  <Text color="emphasized" fontWeight="medium" fontSize="sm">
                    Custom Web Service
                  </Text>
                  <Text color="muted" fontSize="sm" mt={2}>
                    Compose a custom web service using functions
                  </Text>
                </RadioCard>

                <RadioCard value={"CLOUD_FUNCTION"}>
                  <Text color="emphasized" fontWeight="medium" fontSize="sm">
                    Cloud Function
                  </Text>
                  <Text color="muted" fontSize="sm" mt={2}>
                    Build a cloud function from faasbase functions.
                  </Text>
                </RadioCard>

                <RadioCard value={"DOCKER"}>
                  <Text color="emphasized" fontWeight="medium" fontSize="sm">
                    Docker
                  </Text>
                  <Text color="muted" fontSize="sm" mt={2}>
                    Build an application with a docker file.
                  </Text>
                </RadioCard>

                <RadioCard value={"SINGLE_PAGE_APPLICATION"}>
                  <Text color="emphasized" fontWeight="medium" fontSize="sm">
                    Single page application
                  </Text>
                  <Text color="muted" fontSize="sm" mt={2}>
                    Deploy a SPA using S3 and cloudfront
                  </Text>
                </RadioCard>

              </RadioCardGroup>
            </FormControl>

            <FormControl isRequired mt={8}>
              <FormLabel htmlFor="function-desc">Visibility</FormLabel>
              <CustomSelect value={visibility} onChange={(val) => {
                setVisibility(val)
              }}>
                <Option value={"PUBLIC"}>Public</Option>
                <Option value={"PRIVATE"}>Private</Option>
              </CustomSelect>
            </FormControl>
          </DrawerBody>
          <DrawerFooter>
            <Button variant='solid' colorScheme={"gray"} mr={3} onClick={() => props?.onClose()}>
              Cancel
            </Button>
            <Button

              isLoading={createApplicationMutation.isLoading}
              loadingText={"Creating"}
              onClick={() => {
                createApplicationMutation.mutate({
                  name: name,
                  description: description,
                  visibility: visibility,
                  application_type: applicationType,
                  workspace_id: currentWorkspace?.id
                })
              }}
              variant="solid"
              bgGradient='linear(to-r, orange.500, orange.600)'
              _hover={{ backgroundColor: "orange.500" }}
              _active={{ backgroundColor: "orange.500" }}
            >
              Create Application
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
