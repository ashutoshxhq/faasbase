import { useAuth0 } from '@auth0/auth0-react';
import { Box, Button, IconButton, Link, Menu, MenuButton, MenuItem, MenuList, Stack, Tag, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { FiCommand, FiMoreHorizontal, FiMoreVertical } from 'react-icons/fi';
import { NavLink, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { deleteFunction, getFunctions } from '../../api/functions';
import { currentWorkspaceState } from '../../store/workspaces';
import { CreateFunction } from './CreateFunction';
const Functions = () => {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { getAccessTokenSilently } = useAuth0();
  const [currentWorkspace,] = useRecoilState(currentWorkspaceState);

  const query = useQuery(['functions', { getAccessTokenSilently, currentWorkspace }], getFunctions)
  const queryClient = useQueryClient()

  const deleteMutation = useMutation((functionId: string) => deleteFunction(functionId, getAccessTokenSilently), {
    onSuccess: () => {
      queryClient.invalidateQueries([`functions`])
      toast({
        title: "Success",
        description: "Function deleted successfully",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    },

    onError: () => {
      toast({
        title: "Failed",
        description: "Unable to delete function",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    }
  })

  useEffect(() => {
    document.title = "Faasly Console | Functions"
  }, [])

  return (
    <Box height={"calc(100vh - 40px)"} overflowY={"scroll"}>
      <CreateFunction isOpen={isOpen} onClose={onClose} />
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
              <FiCommand size={"40px"} />
              <Box>
                <Text fontSize="2xl" fontWeight="medium">
                  Functions
                </Text>
                <Text color="muted" fontSize="sm">
                  Manage all your the functions here
                </Text>
              </Box>
            </Box>
            <Stack direction="row">
              <Button onClick={onOpen} variant="solid" bgGradient='linear(to-r, orange.500, orange.600)' _hover={{ backgroundColor: "orange.500" }} _active={{ backgroundColor: "orange.500" }}>Create New Function</Button>
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
              to={"/workspaces/" + currentWorkspace?.name + "/functions/" + faaslyFunction?.id}
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

                  <MenuItem bg={"#1e1e1e"} _hover={{ backgroundColor: "whiteAlpha.200" }}
                    onClick={async () => {
                      deleteMutation.mutate(faaslyFunction.id)
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

export default Functions