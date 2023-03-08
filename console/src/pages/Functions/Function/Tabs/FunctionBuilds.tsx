import { useAuth0 } from '@auth0/auth0-react';
import { Avatar, Box, Button, calc, Circle, Container, Flex, Icon, IconButton, Image, Link, Menu, MenuButton, MenuItem, MenuList, Skeleton, Stack, Tag, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { FiCommand, FiMoreVertical } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { getBuilds, getFunctions } from '../../../../api/functions';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { HiCheck } from 'react-icons/hi';

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
                <Flex gap={4}>


                  <Box display={"flex"} flexDirection={"column"} justifyContent="space-around" alignItems={"center"} gap={2}>

                    <Circle
                      size="8"
                      bg={'green.500'}
                      borderWidth={'0'}
                      borderColor={"green.500"}
                    >
                      <Icon as={HiCheck} color="inverted" boxSize="5" />
                    </Circle>
                    <Text
                      px="2"
                      fontSize="10px"
                      fontWeight="semibold"
                      textTransform="uppercase"
                      letterSpacing="widest"
                      color="subtle"

                    >
                      PUSH
                    </Text>

                  </Box>


                </Flex>

                <Box display={"flex"} alignItems={"center"} justifyContent={"center"} gap={3}>
                  <Text fontSize="xl" fontWeight="medium">
                    {build.version}
                  </Text>
                  <Text fontSize="md" color="muted" fontWeight="medium">

                    { `pushed by ${build?.firstname + " " + build?.lastname} ${moment.utc(build.created_at).local().fromNow()}`}


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
                      as={Link} href={`https://function-assets.faasbase.com/${build?.function_id}/${build?.version}/function.zip`} download
                    >
                      Download Build
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Box>
            </Stack>
          </Box>
        ))
        }
      </Container>
    </Box>
  )
}

export default FunctionBuilds