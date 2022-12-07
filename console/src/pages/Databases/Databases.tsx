import { useAuth0 } from '@auth0/auth0-react';
import { Box, Button, IconButton, Link, Menu, MenuButton, MenuItem, MenuList, Stack, Tag, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { FiCommand, FiDatabase, FiMoreHorizontal, FiMoreVertical } from 'react-icons/fi';
import { NavLink, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
// import { deleteFunction, getFunctions } from '../../api/functions';
import { currentWorkspaceState } from '../../store/workspaces';
import CreateDatabase from './CreateDatabase';
// import { CreateFunction } from './CreateFunction';
export default function Databases () {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { getAccessTokenSilently } = useAuth0();

  const data = [{
    id:1,
    hostname:"dev-faasly.ch81a3yupexa.ap-south-1.rds.amazonaws.com",
    username:"admin_user",
    password:"Aqbfjotld9",
    port:5432,
    name:"faasly",
    type:"Postgres",
  }]

  const [currentWorkspace,] = useRecoilState(currentWorkspaceState);

  // const query = useQuery(['functions', { getAccessTokenSilently, currentWorkspace }], getFunctions)
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
    document.title = "Faasly Console | Databases"
  }, [])

  return (
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
      <Box
        display={"flex"}
        justifyContent={"start"}
        alignContent={"start"}
        flexDirection={"column"}
        flexWrap={"wrap"}
        gap={"20px"}
        mt={2}
        p={4}
      >

        {data?.map((db: any, index: number) => (
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
            to={"/workspaces/" + currentWorkspace?.name + "/databases/" + db?.id}
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
                {db.name}
              </Text>
              <Text fontSize={"sm"} color={"#9d9d9d"} noOfLines={1} mb={2}>
                {db.username}
              </Text>
              <Text fontSize={"sm"} color={"#9d9d9d"} noOfLines={1} mb={2}>
                {db.hostname}
              </Text>
              <Box display={"flex"} gap={2} mt={6}>
                <Tag color={"muted"} letterSpacing={"0.2px"} fontSize={"xs"}>
                  Port: {db.port}
                </Tag>
                <Tag color={"muted"} letterSpacing={"0.2px"} fontSize={"xs"}>
                  {db.type}
                </Tag>
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
                <MenuItem
                  onClick={() => { }}
                >
                  Settings
                </MenuItem>

                <MenuItem
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
        )
        )}

      </Box>
    </Box>
  )
}
