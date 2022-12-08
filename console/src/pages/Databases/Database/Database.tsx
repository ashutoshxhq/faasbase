import { useAuth0 } from '@auth0/auth0-react';
import { Box, Button, IconButton, Link, Menu, MenuButton, MenuItem, MenuList, Stack, Tag, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { FiCommand, FiDatabase, FiFileText, FiList, FiMoreHorizontal, FiMoreVertical } from 'react-icons/fi';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { deleteFunction, getFunctions } from '../../../api/functions';
import { currentWorkspaceState } from '../../../store/workspaces';
import { CreateTable } from './CreateTable';
const Database = () => {

  const {databaseId} = useParams();
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { getAccessTokenSilently } = useAuth0();
  const [currentWorkspace,] = useRecoilState(currentWorkspaceState);

  const data = [
    {
      id:1,
      databaseId:1,
      name:"table1",
      description:"doc1",
      readme:"readme"
    },
    {
      id: 2,
      databaseId:1,
      description:"doc1",
      readme:"readme"
    },
    {
      id: 3,
      databaseId:1,
      name:"table3",
      description:"doc1",
      readme:"readme"
    },
  ]
  const database = {
    id:1,
    hostname:"dev-faasly.ch81a3yupexa.ap-south-1.rds.amazonaws.com",
    username:"admin_user",
    password:"Aqbfjotld9",
    port:5432,
    name:"faasly",
    type:"MYSQL",
  }
  useEffect(() => {
    document.title = "Faasly Console | Database | "+ database.name;
  }, [])

  return (
    <Box height={"calc(100vh - 40px)"} overflowY={"scroll"}>
      <CreateTable isOpen={isOpen} onClose={onClose} />
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
              <FiDatabase size={"40px"} />
              <Box>
                <Text fontSize="2xl" fontWeight="medium">
                  {database.name}
                </Text>
                <Text color="muted" fontSize="sm">
                  Manage all your tables here
                </Text>
              </Box>
            </Box>
            <Stack direction="row">
              <Button onClick={onOpen} variant="solid" bgGradient='linear(to-r, orange.500, orange.600)' _hover={{ backgroundColor: "orange.500" }} _active={{ backgroundColor: "orange.500" }}>
                {
                  database.type == "MYSQL" || database.type == "POSTGRES" ? ("Create New Table"):("Create New Schema")
                }
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <Box
        display={"flex"}
        justifyContent={"start"}
        alignContent={"start"}
        flexDirection={"column"}
        flexWrap={"wrap"}
        gap={"30px"}
        mt={2}
        p={4}
      >
        {data?.map((table: any, index: number) => (
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
              to={"/workspaces/" + currentWorkspace?.name + "/databases/"+databaseId+"/tables/" + table?.id}
              as={NavLink}
              display="flex"
              alignItems={"center"}
              justifyContent={"start"}
              flex={1}
              gap={4}
              textDecoration={"none"}
              _hover={{ textDecoration: "none" }}
            >
              <Box bg={"whiteAlpha.200"} p={2} borderRadius={6}>
                <FiFileText size={24} />
              </Box>

              <Box
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"start"}
                flex={1}
              >
                <Text fontSize={"md"} fontWeight={"semibold"} color="#e3e3e3" mb={1}>
                  {table.name}
                </Text>
                <Text fontSize={"sm"} color={"#9d9d9d"} noOfLines={1}>
                  {table.description}
                </Text>
                {/* <Text fontSize={"sm"} color={"#9d9d9d"} noOfLines={1}>
                  {table.readme}
                </Text> */}
              </Box>
            </Link>
            <Box display={"flex"} gap={"4"} justifyContent={"center"} alignItems={"center"} ml={4}>
              {/* <Box
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                minW={"80px"}
              >
                <Text fontSize={"lg"} fontWeight={"semibold"} color="#e3e3e3">
                  10
                </Text>
                <Text fontSize={"sm"} color={"#9d9d9d"} noOfLines={1}>
                  Fields
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
                  id
                </Text>
                <Text fontSize={"sm"} color={"#9d9d9d"} noOfLines={1}>
                  Primary Key
                </Text>
              </Box> */}
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
                  <MenuItem bg={"#1e1e1e"} _hover={{ backgroundColor: "whiteAlpha.200" }}
                    onClick={() => { }}
                  >
                    Settings
                  </MenuItem>

                  {/* <MenuItem bg={"#1e1e1e"} _hover={{ backgroundColor: "whiteAlpha.200" }}
                    onClick={async () => {
                      deleteMutation.mutate(table.id)
                    }}
                  >
                    Delete
                  </MenuItem> */}
                </MenuList>
              </Menu>
            </Box>
          </Box>
        )
        )}

      </Box>
    </Box>
  )
}

export default Database;