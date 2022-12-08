import { useAuth0 } from '@auth0/auth0-react';
import { Box, Button, IconButton, Link, Menu, MenuButton, MenuItem, MenuList, Stack, Tag, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { FiCommand, FiMoreHorizontal, FiMoreVertical } from 'react-icons/fi';
import { NavLink, useNavigate } from 'react-router-dom';
import { currentWorkspaceState } from '../../store/workspaces';
import { useRecoilState } from 'recoil';
import { searchFunctions } from '../../api/functions';

interface MFProps {
  searchQuery: String,
}
function MarketplaceFunctions({ searchQuery }: MFProps) {

  const toast = useToast()
  const { getAccessTokenSilently } = useAuth0();
  const [currentWorkspace,] = useRecoilState(currentWorkspaceState);

  const query = useQuery(['search-functions', { getAccessTokenSilently, searchQuery, currentWorkspace }], searchFunctions)

  useEffect(() => {
    document.title = "Faasly Console | Marketplace | Functions"
  }, [])
  return (
    <Box
      display={"flex"}
      justifyContent={"start"}
      alignContent={"start"}
      flexDirection={"column"}
      flexWrap={"wrap"}
      gap={"20px"}
    >

      {query.data?.data?.data?.map((faaslyFunction: any, index: number) => (
        <Box
          key={index}
          borderRadius={8}
          bg={"#1e1e1e"}
          boxShadow={"2xl"}
          border={"solid 0px #424242fd"}
          px={6}
          py={4}
          flex={1}
          w={"full"}
          display="flex"
          alignItems={"center"}
          justifyContent={"space-between"}
          cursor={"pointer"}
          _hover={{ background: "#1e1e1e" }}
        >
          <Link
            to={"/marketplace/functions/" + faaslyFunction?.id}
            as={NavLink}
            display="flex"
            alignItems={"center"}
            justifyContent={"start"}
            flex={1}
            gap={4}
            textDecoration={"none"}
            _hover={{ textDecoration: "none" }}
          >
            {/* <Box
                height={"40px"}
                width={"40px"}
                display="flex"
                alignItems={"center"}
                justifyContent={"center"}
              >
                {faaslyFunction.logo !== "" && faaslyFunction.logo ? (
                  <Image
                    borderRadius={"md"}
                    src={faaslyFunction.logo}
                    bgSize="cover"
                    fit={"cover"}
                    h="100%"
                    w="100%"
                    loading="eager"
                  />
                ) : (
                  <Box p={2} bg={'whiteAlpha.200'} display="flex" justifyContent={"center"} alignItems={"center"} borderRadius={"md"}>
                    <Icon as={FiCommand} boxSize="6" color="subtle" />
                  </Box>
                )}
              </Box> */}
            <Box bg={"whiteAlpha.200"} p={2} borderRadius={6}>
              <FiCommand size={24} />
            </Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems={"start"}
              flex={1}
            >
              <Text fontSize={"md"} fontWeight={"semibold"} color="#e3e3e3" mb={1}>
                {faaslyFunction.name}
              </Text>
              <Text fontSize={"sm"} color={"#9d9d9d"} noOfLines={1}>
                {faaslyFunction.description}
              </Text>
            </Box>
          </Link>
          <Box display={"flex"} gap={"4"} justifyContent={"center"} alignItems={"center"} ml={4}>
            <Box
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems={"center"}
              minW={"80px"}
            >
              <Text fontSize={"lg"} fontWeight={"semibold"} color="#e3e3e3">
                42
              </Text>
              <Text fontSize={"sm"} color={"#9d9d9d"} noOfLines={1}>
                Forks
              </Text>
            </Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems={"center"}
              minW={"80px"}
            >
              <Text fontSize={"lg"} fontWeight={"semibold"} color="#e3e3e3">
                42
              </Text>
              <Text fontSize={"sm"} color={"#9d9d9d"} noOfLines={1}>
                Stars
              </Text>
            </Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems={"center"}
              minW={"100px"}
            >
              <Text fontSize={"lg"} fontWeight={"semibold"} color="#e3e3e3">
                {faaslyFunction.latest_version === "" || !faaslyFunction.latest_version ? "0.0.1" : faaslyFunction.latest_version}
              </Text>
              <Text fontSize={"sm"} color={"#9d9d9d"} noOfLines={1}>
                Version
              </Text>
            </Box>
            <Box   display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems={"center"}
              height={"100%"}>
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
                    Clone
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>


          </Box>
        </Box>
      )
      )}
    </Box>
  )
}

export default MarketplaceFunctions;