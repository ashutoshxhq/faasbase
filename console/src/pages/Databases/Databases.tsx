import { useAuth0 } from '@auth0/auth0-react';
import { Box, Button, Card, Divider, IconButton, Link, Menu, MenuButton, MenuItem, MenuList, Stack, Tag, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { FiCommand, FiDatabase, FiMoreHorizontal, FiMoreVertical, FiPlus } from 'react-icons/fi';
import { NavLink, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { getDatabases } from '../../api/databases';
// import { deleteFunction, getFunctions } from '../../api/functions';
import { currentWorkspaceState } from '../../store/workspaces';
import CreateDatabase from './CreateDatabase';
// import { CreateFunction } from './CreateFunction';
export default function Databases () {
  const navigate = useNavigate()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { getAccessTokenSilently } = useAuth0();
  const [currentWorkspace,] = useRecoilState(currentWorkspaceState);

  const query = useQuery(['databases', { getAccessTokenSilently, currentWorkspace }], getDatabases)
  // const queryClient = useQueryClient()

  // const deleteMutation = useMutation((functionId: string) => deleteFunction(functionId, getAccessTokenSilently), {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries([`functions`])
  //     toast({
  //       title: "Success",
  //       description: "Function deleted successfully",
  //       status: "success",
  //       position: "bottom-right",
  //       duration: 5000,
  //       isClosable: true,
  //     });
  //   },

  //   onError: () => {
  //     toast({
  //       title: "Failed",
  //       description: "Unable to delete function",
  //       status: "error",
  //       position: "bottom-right",
  //       duration: 5000,
  //       isClosable: true,
  //     });
  //   }
  // })

  useEffect(() => {
    document.title = "Faasbase Console | Databases"
  }, [])

  return (
    <>
  
    <Box height={"calc(100vh - 40px)"} overflowY={"scroll"}>
      <CreateDatabase isOpen={isOpen} onClose={onClose} />
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
                  Databases
                </Text>
                <Text color="muted" fontSize="sm">
                  Manage all your the databases here
                </Text>
              </Box>
            </Box>
            <Stack direction="row">
              <Button onClick={onOpen} variant="solid" bgGradient='linear(to-r, orange.500, orange.600)' _hover={{ backgroundColor: "orange.500" }} _active={{ backgroundColor: "orange.500" }}>Create New Database</Button>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <Card bg={"#1e1e1e"} w={"full"} mt={"4"}>
        <Box w={"full"} display="flex" justifyContent={"space-between"} alignItems={"center"} p={4}>
          <Box display="flex" justifyContent={"space-between"} alignItems={"center"} gap={2}>
            <Tag> Filter By</Tag>
            <Tag> <FiPlus /></Tag>
          </Box>

        </Box>
        <Divider />
        <Box display={"flex"} flexDirection={"column"} mb={6}>
          {/* create a list of applications where name if application is in left and some other details like application type, version, stars and forks and three dot menu on the right */}
          {query.data?.data?.data?.map((db: any, index: number) => (
            <Box display={"flex"} justifyContent={"start"} alignItems={"center"} borderBottom={"solid 1px"} borderColor={"#303030"} _hover={{ backgroundColor: "whiteAlpha.100" }}>
              <Box cursor={"pointer"} onClick={() => {
                navigate(`/workspaces/${currentWorkspace?.name}/databases/${db.id}`)
              }} display={"flex"} justifyContent={"start"} flexDirection={"column"} alignItems={"start"} gap={1} py={4} px={8}>
                <Text fontSize={"lg"} fontWeight={"medium"}>{db.name}</Text>
                <Text fontSize={"xs"} color={"subtle"}>{db.hostname}</Text>
              </Box>
              <Box display={"flex"} justifyContent={"end"} alignItems={"center"} flex={1} gap={4} p={4}>
                <Tag py={2} px={4} letterSpacing={"0.2px"} fontSize={"sm"}>
                  {db.database_type}
                </Tag>
                <Tag py={2} px={4} letterSpacing={"0.2px"} fontSize={"sm"}>{db.port}</Tag>
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
                      Clone
                    </MenuItem>
                    <MenuItem bg={"#1e1e1e"} _hover={{ backgroundColor: "whiteAlpha.200" }}
                      onClick={() => { }}
                    >
                      Settings
                    </MenuItem>

                    <MenuItem bg={"#1e1e1e"} _hover={{ backgroundColor: "whiteAlpha.200" }}
                      onClick={async () => {
                        // deleteMutation.mutate(db.id)
                      }}
                    >
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>

              </Box>
            </Box>
          ))}
        </Box>
      </Card>
    </Box>
    </>
  )
}
