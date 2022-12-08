import { useAuth0 } from '@auth0/auth0-react'
import { Box, IconButton, Link, Menu, MenuButton, MenuItem, MenuList, Tag, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { FiMoreHorizontal } from 'react-icons/fi'
import { NavLink, useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { searchApplications } from '../../api/applications'
import { currentWorkspaceState } from '../../store/workspaces'

interface MAProps {
  searchQuery: String,
}
function MarketplaceApplications({searchQuery}: MAProps) {
  
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { getAccessTokenSilently } = useAuth0();
  const [currentWorkspace,] = useRecoilState(currentWorkspaceState);
  const navigate = useNavigate()
  const query = useQuery(['search-applications', { getAccessTokenSilently, currentWorkspace, searchQuery }], searchApplications)
  useEffect(() => {
    document.title = "Faasly Console | Marketplace | Applicationd"
  }, [])
  return (
    <Box
        display={"flex"}
        justifyContent={"start"}
        alignContent={"start"}
        flexWrap={"wrap"}
        mt={2}
        gap={"20px"}
      >
        {query.data?.data?.data?.map((faaslyApplication: any, index: number) => (
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
              to={"/marketplace/applications/" + faaslyApplication?.id}
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
                  {faaslyApplication.name}
                </Text>
                <Text fontSize={"sm"} color={"#9d9d9d"} noOfLines={1} mb={2}>
                  {faaslyApplication.description}
                </Text>
                <Box display={"flex"} gap={2} mt={6}>
                  <Tag color={"muted"} letterSpacing={"0.2px"} fontSize={"xs"}>
                    {faaslyApplication.application_type === "WEB_SERVICE" ? "Custom Web Service" : null}
                    {faaslyApplication.application_type === "CLOUD_FUNCTION" ? "Cloud Function" : null}
                    {faaslyApplication.application_type === "DOCKER" ? "Docker" : null}
                    {faaslyApplication.application_type === "SINGLE_PAGE_APPLICATION" ? "Single Page Application" : null}

                  </Tag>
                  {faaslyApplication.latest_version === "" || !faaslyApplication.latest_version ? <Tag color={"muted"} letterSpacing={"0.2px"} fontSize={"xs"}>No Builds</Tag> : <Tag color={"muted"} letterSpacing={"0.2px"} fontSize={"xs"}>Version: {faaslyApplication.latest_version}</Tag>}
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
                </MenuList>
              </Menu>
            </Box>
          </Box>
        )
        )}

      </Box>
  )
}

export default MarketplaceApplications