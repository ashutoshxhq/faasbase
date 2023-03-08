import { useAuth0 } from '@auth0/auth0-react';
import { Avatar, Box, Button, Circle, Container, Flex, FormControl, FormLabel, Icon, IconButton, Input, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Stack, Tag, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { createApplicationBuild, getApplicationBuilds } from '../../../../api/applications';
import moment from 'moment';
import { useRecoilState } from 'recoil';
import { currentWorkspaceState } from '../../../../store/workspaces';
import { getKubernetesClusters } from '../../../../api/integrations';
import { HiCheck, HiDotsHorizontal, HiX } from 'react-icons/hi';
import { FiMoreVertical } from 'react-icons/fi';

function MarketplaceApplicationBuildsAndDeployments() {
  const { applicationId } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const query = useQuery([`application-${applicationId}-builds`, { getAccessTokenSilently, applicationId }], getApplicationBuilds);

  return (
    <Box as="section">
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


                </Flex>

                <Box display={"flex"} alignItems={"center"} justifyContent={"center"} gap={3}>
                  <Text fontSize="xl" fontWeight="medium">
                    {build.version}
                  </Text>
                  <Text fontSize="md" color="muted" fontWeight="medium">

                    {build?.build_status === "BUILDING" ? `build started ${moment.utc(build.created_at).local().fromNow()}` :
                      build?.build_status === "ERROR" ? `build failed ${moment.utc(build.deployed_at).local().fromNow()}` :
                        build?.build_status === "SUCCESS" ? `built ${moment.utc(build.deployed_at).local().fromNow()}` : ""}


                  </Text>

                </Box>
              </Stack>
              <Box display="flex" gap={4}>
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
                      Download Build
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

export default MarketplaceApplicationBuildsAndDeployments

