import { useAuth0 } from '@auth0/auth0-react';
import { Box, Button, Flex, IconButton, Link, Menu, MenuButton, MenuItem, MenuList, Stack, Tag, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { FiDatabase, FiPlus } from 'react-icons/fi';
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { getDatabase, getTables } from '../../../api/databases';
import { currentWorkspaceState } from '../../../store/workspaces';
import { CreateTable } from './CreateTable';
const Database = () => {
  const navigate= useNavigate();
  const {databaseId, workspaceName} = useParams();
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { getAccessTokenSilently } = useAuth0();
  const [currentWorkspace,] = useRecoilState(currentWorkspaceState);
  const queryClient = useQueryClient()

  const database = useQuery(['databases-'+databaseId, { getAccessTokenSilently, databaseId }], getDatabase);
  const query = useQuery(['databases-'+databaseId+"-tables", { getAccessTokenSilently, databaseId }], getTables)
  console.log(query?.data?.data?.data)
  useEffect(() => {
    document.title = "Faasly Console | Database | " + database?.data?.data?.data?.name;
  }, )
  return (
    <Box height={"calc(100vh - 40px)"} overflowY={"scroll"}>
      <CreateTable isOpen={isOpen} onClose={onClose} />
      <Box
        display={"flex"}
        justifyContent={"start"}
        alignContent={"start"}
        flexDirection={"row"}
        flexWrap={"wrap"}
        gap={"20px"}
      >
        <Box
          as="section"
          borderRight={"solid 1px"}
          borderColor="#42424252"
          minHeight={"100vh"}
          flex="1"
        >
          <Stack justify="space-between" spacing="1" data-tauri-drag-region>
            <Stack shouldWrapChildren p={"2"}>
              <Stack 
                borderBottom={"solid 1px"}
                borderColor="#42424252"
                justifyContent={"center"} alignItems={"center"}>
                  <Box _hover={{cursor:"pointer"}} onClick={() => {
                    navigate(`/workspaces/${workspaceName}/databases/${databaseId}`)
                  }} 
                  display="flex" gap={4} p={4} justifyContent={"center"} alignItems={"center"}>
                    <FiDatabase size={"20px"} />
                    <Box>
                      <Text fontSize="2xl" fontWeight="medium">
                        {database?.data?.data?.data?.name}
                      </Text>
                    </Box>
                  </Box>
              </Stack>
              <Stack
                borderBottom={"solid 1px"}
                borderColor="#42424252"
                justifyContent={"center"} alignItems={"center"}>
                  <Box display="flex" p = {4} w={"full"} justifyContent={"space-between"} alignItems={"center"} gap={2}>
                    <Text fontSize="xl" fontWeight="medium">
                      Tables
                    </Text>
                    <Tooltip label={"Create New Table"} placement='right'>
                      <Tag onClick={onOpen} _hover={{cursor:"pointer"}} > <FiPlus /></Tag>
                    </Tooltip>
                  </Box>
              </Stack>
              {
                query?.data?.data?.data?.map((table: any) => (
                  <Stack key={table.id} alignItems={"center"}>
                    <Button as={NavLink}  to={`/workspaces/${workspaceName}/databases/${databaseId}/tables/${table?.id}`} variant="ghost" width={"full"}justifyContent="center"_hover={{ backgroundColor: "whiteAlpha.200" }} _active={{ backgroundColor: "whiteAlpha.200" }} borderRadius={"8px"} >
                      {table?.name}
                    </Button>
                  </Stack>
                ))
              }
            </Stack>
          </Stack>
        </Box>
        <Box flex={"10"}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default Database;