import { useAuth0 } from '@auth0/auth0-react';
import { Avatar, Box, Button, calc, Circle, CircularProgress, Container, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, FormControl, FormLabel, Icon, IconButton, Image, Input, Link, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Skeleton, Stack, Tag, Text, Textarea, useDisclosure, useToast } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FiCommand, FiMoreVertical } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { createApplicationBuild, getApplication, getApplicationBuilds } from '../../../../api/applications';
import moment from 'moment';
import { useRecoilState } from 'recoil';
import { currentWorkspaceState } from '../../../../store/workspaces';
import { getCurrentWorkspaceMembers } from '../../../../api/workspaces';
import { getKubernetesCluster, getKubernetesClusters } from '../../../../api/integrations';
import { HiCheck, HiDotsHorizontal, HiX } from 'react-icons/hi';

function ApplicationBuildsAndDeployments() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isLogsDrawerOpen, onOpen: onLogsDrawerOpen, onClose: onLogsDrawerClose } = useDisclosure();
  const { applicationId } = useParams();
  const [selectedEvent, setSelectedEvent] = useState<any>()
  const { getAccessTokenSilently } = useAuth0();
  const applicationQuery = useQuery([`application-${applicationId}`, { getAccessTokenSilently, applicationId }], getApplication)
  const query = useQuery({ queryKey: [`application-${applicationId}-builds`, { getAccessTokenSilently, applicationId }], queryFn: getApplicationBuilds, refetchInterval: 5000 });

  return (
    <Box as="section">
      <NewApplicationDeployment isOpen={isOpen} onClose={onClose} />
      <LogsDrawer isOpen={isLogsDrawerOpen} onClose={onLogsDrawerClose} event={selectedEvent} />

      <Container
        as='section'
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
            <Text fontSize="xl" fontWeight="medium">Application Builds</Text>
            <Text color="muted" fontSize="sm">
              Manage builds and trigger application deployments
            </Text>
          </Box>
          <Button
            variant="solid"
            bgGradient='linear(to-r, orange.500, orange.600)'
            _hover={{ backgroundColor: "orange.500" }}
            _active={{ backgroundColor: "orange.500" }}
            onClick={() => {
              onOpen()
            }}
            loadingText="Updating"
          >
            Trigger Build/Deployment
          </Button>
        </Box>
        {query?.data?.data?.data?.map((build: any, index: number) => (
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
                spacing={'4'}
              >
                <Flex gap={4}>


                  <Box display={"flex"} flexDirection={"column"} justifyContent="space-around" alignItems={"center"} gap={2}>

                    {build?.build_status === "SUCCESS" ? <Circle
                      size="8"
                      bg={'green.500'}
                      borderWidth={'0'}
                      borderColor={"green.500"}
                    >
                      <Icon as={HiCheck} color="inverted" boxSize="5" />
                    </Circle> : null}

                    {build?.build_status === "ERROR" ? <Circle
                      size="8"
                      bg={'red.500'}
                      borderWidth={'0'}
                      borderColor={"red.500"}
                    >
                      <Icon as={HiX} color="inverted" boxSize="5" />
                    </Circle> : null}

                    {build?.build_status === "BUILDING" ? <Circle
                      size="8"
                      bg={'blue.500'}
                      borderWidth={'0'}
                      borderColor={"blue.500"}
                    >
                      <Icon as={HiDotsHorizontal} color="white" boxSize="5" />
                    </Circle> : null}

                    <Text
                      px="2"
                      fontSize="10px"
                      fontWeight="semibold"
                      textTransform="uppercase"
                      letterSpacing="widest"
                      color="subtle"

                    >
                      BUILD
                    </Text>

                  </Box>

                  <Box display={"flex"} flexDirection={"column"} justifyContent="center" alignItems={"center"} gap={2}>
                    {build?.deployment_status === "SUCCESS" ? <Circle
                      size="8"
                      bg={'green.500'}
                      borderWidth={'0'}
                      borderColor={"green.500"}
                    >
                      <Icon as={HiCheck} color="inverted" boxSize="5" />
                    </Circle> : null}

                    {build?.deployment_status === "ERROR" ? <Circle
                      size="8"
                      bg={'red.500'}
                      borderWidth={'0'}
                      borderColor={"red.500"}
                    >
                      <Icon as={HiX} color="inverted" boxSize="5" />
                    </Circle> : null}

                    {build?.deployment_status === "NOT_STARTED" ? <Circle
                      size="8"
                      bg={'blue.500'}
                      borderWidth={'0'}
                      borderColor={"blue.500"}
                    >
                      <Icon as={HiDotsHorizontal} color="white" boxSize="5" />
                    </Circle> : null}

                    {build?.deployment_status === "DEPLOYING" ? <Circle
                      size="8"
                      bg={'blue.500'}
                      borderWidth={'0'}
                      borderColor={"blue.500"}
                    >
                      <Icon as={HiDotsHorizontal} color="white" boxSize="5" />
                    </Circle> : null}
                    <Text
                      px="2"
                      fontSize="10px"
                      fontWeight="semibold"
                      textTransform="uppercase"
                      letterSpacing="widest"
                      color="subtle"
                    >
                      DEPLOY
                    </Text>
                  </Box>


                </Flex>

                <Box display={"flex"} alignItems={"center"} justifyContent={"center"} gap={3}>
                  <Text fontSize="xl" fontWeight="medium">
                    {build.version}
                  </Text>
                  <Text fontSize="md" color="muted" fontWeight="medium">

                    {build?.build_status === "BUILDING" ? `build started ${moment.utc(build.created_at).local().fromNow()}` :
                      build?.build_status === "ERROR" ? `build failed ${moment.utc(build.deployed_at).local().fromNow()}` :
                        build?.deployment_status === "DEPLOYING" ? `deployment started ${moment.utc(build.built_at).local().fromNow()}` :
                          build?.deployment_status === "ERROR" ? `deployment failed ${moment.utc(build.deployed_at).local().fromNow()}` :
                            build?.deployment_status === "SUCCESS" ? `built & deployed ${moment.utc(build.deployed_at).local().fromNow()}` : ""}


                  </Text>

                </Box>
              </Stack>
              <Box display="flex" gap={4}>
                {applicationQuery?.data?.data?.data?.deployed_version === build.version ? <Box display="flex" justifyContent={"center"} alignItems={"center"}>
                  <Tag colorScheme={"green"}>deployed</Tag>
                </Box> : ""}


                <Box display={"flex"} flexDirection={"column"} justifyContent="space-around" alignItems={"center"} gap={2}>



                  {/* <Text
                    px="2"
                    fontSize="10px"
                    fontWeight="semibold"
                    textTransform="uppercase"
                    letterSpacing="widest"
                    color="subtle"

                  >
                    VERSION
                  </Text> */}

                </Box>

                <Box
                  display="flex"
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Avatar size={"sm"} name={build.firstname} />
                </Box>
                <Menu size={"2xl"}>
                  <MenuButton
                    as={IconButton}
                    _hover={{ backgroundColor: "whiteAlpha.200" }}
                    _active={{ backgroundColor: "whiteAlpha.200" }}
                    aria-label="Options"
                    icon={<FiMoreVertical size={26} />}
                    variant="ghost"
                  />
                  <MenuList bg={"#1e1e1e"} minW={"10px"}>
                    <MenuItem bg={"#1e1e1e"} _hover={{ backgroundColor: "whiteAlpha.200" }}
                      onClick={() => { }}
                    >
                      Deploy Build
                    </MenuItem>

                    <MenuItem as={Link} href={`https://application-assets.faasbase.com/${build?.application_id}/${build?.version}/application.zip`} download bg={"#1e1e1e"} _hover={{ backgroundColor: "whiteAlpha.200" }}
                      onClick={() => { }}
                    >
                      Download Build
                    </MenuItem>

                    <MenuItem bg={"#1e1e1e"} _hover={{ backgroundColor: "whiteAlpha.200" }}
                      onClick={() => {
                        setSelectedEvent(build.logs)
                        onLogsDrawerOpen()
                      }}
                    >
                      Show Build Logs
                    </MenuItem>
                  </MenuList>
                </Menu>
                {/* <Button variant="solid" bgGradient='linear(to-r, orange.500, orange.600)' _hover={{ backgroundColor: "orange.500" }} _active={{ backgroundColor: "orange.500" }}>Deploy / Rollback</Button> */}
              </Box>
            </Stack>
          </Box>))
        }
      </Container>
    </Box>
  )
}

export default ApplicationBuildsAndDeployments





interface LogsDrawerProp {
  event: any;
  isOpen: boolean;
  onClose: () => void;
}

export function LogsDrawer(props: LogsDrawerProp) {

  const [events, setEvents] = useState<string[]>([])

  useEffect(() => {
    let logs: string[] = []
    props.event?.map((log: any, index: number) => {
      let log_data: string = ""
      Object.entries(log).map(([key, value]: any) => {
        if (value) {
          log_data += `${key}: ${JSON.stringify(value).replace("[91m", "").replace("\\u001b[91m", "").replace("\\n", "").replace("\\u001b[0m", "").replace("\\r", "")} \t\t`
        }
      })
      if (log_data) {
        logs.push(log_data)
      }
    })

    setEvents(logs)
  }, [props.event])


  return (
    <>
      <Drawer isOpen={props.isOpen} onClose={props.onClose} size="2xl" >
        <DrawerOverlay />
        <DrawerContent maxW={"8xl"} bg={"#1e1e1e"} overflowY={"scroll"}>
          <DrawerCloseButton />
          <DrawerHeader display="flex" alignItems={"center"} fontWeight={"medium"}> Application build/deployment logs </DrawerHeader>
          <DrawerBody>
            <Box bg={"whiteAlpha.200"} borderRadius="md" px={6} py={4} display="flex" flexDirection={"column"} gap={"2"}>
              {events.map((event: any, index: number) => <Box>{event}</Box>)}
            </Box>
          </DrawerBody>

        </DrawerContent>
      </Drawer>
    </>
  );
}


interface NewApplicationDeploymentProp {
  isOpen: boolean;
  onClose: () => void;
}

export const NewApplicationDeployment = (props: NewApplicationDeploymentProp) => {
  const { applicationId } = useParams();
  const { getAccessTokenSilently, getIdTokenClaims } = useAuth0()
  const toast = useToast();
  const [clusterId, setClusterId] = useState("");
  const [tag, setTag] = useState("");
  const [changelog, setChangelog] = useState("");
  const [currentWorkspace,] = useRecoilState(currentWorkspaceState);

  const clustersQuery = useQuery([`clusters`, { getAccessTokenSilently, currentWorkspace }], getKubernetesClusters)

  const queryClient = useQueryClient();
  const createApplicationDeploymentMutation = useMutation((data: any) => {
    return createApplicationBuild(applicationId || "", data, getAccessTokenSilently)
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries([`application-${applicationId}-builds`])
      toast({
        title: "Success",
        description: "Application build added successfully",
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
        description: "Unable to add application build",
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
          <ModalHeader>Trigger Build</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired mb={8}>
              <FormLabel htmlFor="permission">Tag / Version</FormLabel>
              <Input type="text" variant={"outline"} value={tag} onChange={(e) => {
                setTag(e.target.value)
              }} />
            </FormControl>

            <FormControl isRequired mb={8}>
              <FormLabel htmlFor="permission">Changelog</FormLabel>
              <Textarea value={changelog} onChange={(e) => {
                setChangelog(e.target.value)
              }} />
            </FormControl>

            <FormControl isRequired mb={8} mt={4}>
              <FormLabel htmlFor="user">Cluster (Deploy to)</FormLabel>
              <Select
                id="user"
                border={"2px"}
                placeholder="Select Cluster"
                onChange={(e) => setClusterId(e.target.value)}
              >
                {
                  clustersQuery?.data?.data?.data.map((cluster: any, index: number) =>
                    <option value={cluster.id} key={cluster.id}>{cluster.name} ({cluster?.provider_config?.region})</option>
                  )
                }
              </Select>
            </FormControl>

          </ModalBody>

          <ModalFooter>
            <Button variant='solid' colorScheme={"gray"} mr={3} onClick={() => props?.onClose()}>
              Cancel
            </Button>
            <Button
              isLoading={createApplicationDeploymentMutation.isLoading}
              loadingText={"Triggering"}
              onClick={async () => {
                let claims = await getIdTokenClaims();
                createApplicationDeploymentMutation.mutate({
                  version: tag,
                  application_id: applicationId,
                  changelog,
                  config: {
                    cluster_id: clusterId
                  },
                  user_id: claims?.user_id
                })
              }}
              variant="solid"
              bgGradient='linear(to-r, orange.500, orange.600)'
              _hover={{ backgroundColor: "orange.500" }}
              _active={{ backgroundColor: "orange.500" }}
            >
              Trigger Deployment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
