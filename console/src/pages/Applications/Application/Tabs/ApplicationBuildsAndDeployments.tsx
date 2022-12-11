import { useAuth0 } from '@auth0/auth0-react';
import { Avatar, Box, Button, calc, Circle, Container, FormControl, FormLabel, Icon, IconButton, Image, Input, Link, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Skeleton, Stack, Tag, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FiCommand, FiMoreVertical } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { createApplicationBuild, getApplicationBuilds } from '../../../../api/applications';
import moment from 'moment';
import { useRecoilState } from 'recoil';
import { currentWorkspaceState } from '../../../../store/workspaces';
import { getCurrentWorkspaceMembers } from '../../../../api/workspaces';
import { getKubernetesCluster, getKubernetesClusters } from '../../../../api/integrations';
import { HiCheck, HiX } from 'react-icons/hi';

function ApplicationBuildsAndDeployments() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { applicationId } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const query = useQuery([`application-${applicationId}-builds`, { getAccessTokenSilently, applicationId }], getApplicationBuilds);
  
  return (
    <Box as="section">
      <NewApplicationDeployment isOpen={isOpen} onClose={onClose} />
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
            <Text fontSize="xl" fontWeight="medium">Deployments</Text>
            <Text color="muted" fontSize="sm">
              Manage all the application deployments
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
            Trigger Deployment
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
                <Circle
                  size="8"
                  bg={'red.500'}
                  borderWidth={'0'}
                  borderColor={"red.500"}
                >
                  <Icon as={HiX} color="inverted" boxSize="5" />

                </Circle>
                <Box display={"flex"} alignItems={"center"} justifyContent={"center"} gap={3}>
                  <Text fontSize="xl" fontWeight="medium">
                    {build.version}
                  </Text>
                  <Text fontSize="md" color="muted" fontWeight="medium">
                    build failed {moment(new Date(build.created_at)).fromNow()}
                  </Text>
                  {/* <Text fontSize="md" color="muted" fontWeight="medium">
                    by {build.firstname} {build.lastname}
                  </Text> */}
                  {/* <Text mt={1} color="muted" fontSize="sm">
                    {build.email}

                  </Text> */}
                </Box>
              </Stack>
              <Box display="flex" gap={4}>
                <Box display="flex" justifyContent={"center"} alignItems={"center"}>
                  <Tag colorScheme={"green"}>currently deployed</Tag>
                </Box>
                <Box display="flex" justifyContent={"center"} alignItems={"center"}>
                  <Tag >by {build?.firstname} {build?.lastname}</Tag>
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
                    <MenuItem bg={"#1e1e1e"} _hover={{ backgroundColor: "whiteAlpha.200" }}
                      onClick={() => { }}
                    >
                      Clone Build
                    </MenuItem>
                    <MenuItem bg={"#1e1e1e"} _hover={{ backgroundColor: "whiteAlpha.200" }}
                      onClick={() => { }}
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
          <ModalHeader>Trigger Deployment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired mb={8} mt={4}>
              <FormLabel htmlFor="user">Cluster (Deployment Target)</FormLabel>
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
            <FormControl isRequired mb={8}>
              <FormLabel htmlFor="permission">Tag / Version</FormLabel>
              <Input type="text" variant={"outline"} value={tag} onChange={(e) => {
                setTag(e.target.value)
              }} />
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
