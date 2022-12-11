import { useAuth0 } from '@auth0/auth0-react';
import { Avatar, Box, Button, calc, Container, Icon, IconButton, Image, Link, Menu, MenuButton, MenuItem, MenuList, Skeleton, Stack, Tag, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { FiCommand } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { getBuilds, getFunctions } from '../../../../api/functions';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';

const FunctionBuilds = () => {
  const { functionId } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const query = useQuery([`function-${functionId}-builds`, { getAccessTokenSilently, functionId }], getBuilds);
  return (
    <Box as="section">
      <Container
        as='section'
        display={"flex"}
        justifyContent={"center"}
        alignContent={"start"}
        flexWrap={"wrap"}
        px={0} maxW={"full"}
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
                <Box
                  display="flex"
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Avatar name={build?.firstname} size={"sm"}/>

                </Box>
                <Box display={"flex"} flexDirection='column' justifyContent={"center"}>
                  <Text fontSize="md" fontWeight="medium">
                    {build?.firstname + " " + build?.lastname}
                  </Text>
                  <Text fontSize="xs" color={"subtle"}>
                    {build?.email}
                  </Text>
                  
                </Box>

              </Stack>
              <Stack direction="row">
                <Tag fontSize={"sm"} py={2} px={4}>Pushed: {moment(build?.created_at).fromNow()}</Tag>
                <Tag fontSize={"sm"} py={2} px={4}>v{build.version}</Tag>
              </Stack>
            </Stack>
          </Box>))
        }
      </Container>
    </Box>
  )
}

export default FunctionBuilds