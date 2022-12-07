import { useAuth0 } from '@auth0/auth0-react';
import { Avatar, Box, Button, Circle, Container, FormControl, FormLabel, Icon,  Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Stack, Tag, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { createApplicationBuild, getApplicationBuilds } from '../../../../api/applications';
import moment from 'moment';
import { useRecoilState } from 'recoil';
import { currentWorkspaceState } from '../../../../store/workspaces';
import { getKubernetesClusters } from '../../../../api/integrations';
import { HiX } from 'react-icons/hi';

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
        maxW={"8xl"}
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
                    build failed {moment(build.created_at).fromNow()}
                  </Text>
                 
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
              </Box>
            </Stack>
          </Box>))
        }
      </Container>
    </Box>
  )
}

export default MarketplaceApplicationBuildsAndDeployments

