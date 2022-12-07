import { useAuth0 } from "@auth0/auth0-react";
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Container, Flex, FormControl, FormLabel, Input, Stack, Text, Textarea, useColorModeValue, useDisclosure, useToast } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { deleteWorkspace, getCurrentWorkspace, updateWorkspace } from "../../../api/workspaces";
import { currentWorkspaceState } from "../../../store/workspaces";

const GeneralSettings = () => {
  const [currentWorkspace, setcurrentWorkspace] = useRecoilState(currentWorkspaceState);
  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const { getAccessTokenSilently, getIdTokenClaims } = useAuth0();
  const queryClient = useQueryClient()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast()
  const cancelRef = useRef<any>();
  const navigate = useNavigate()
  const query = useQuery([`current-workspace`, { getAccessTokenSilently, currentWorkspace }], getCurrentWorkspace)
  const mutation = useMutation((data: any) => updateWorkspace(id || "", data, getAccessTokenSilently), {
    onSuccess: () => {
      queryClient.invalidateQueries([`current-workspace`])
      queryClient.invalidateQueries([`workspaces`])
      toast({
        title: "Success",
        description: "Function updated successfully",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      if (name && description && currentWorkspace){
        setcurrentWorkspace({
          ...currentWorkspace,
          name,
          description
        })
      }
    },

    onError: () => {
      toast({
        title: "Failed",
        description: "Unable to update function",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    }
  })

  const deleteMutation = useMutation(() => deleteWorkspace(id || "", getAccessTokenSilently), {
    onSuccess: () => {
      queryClient.invalidateQueries([`workspaces`])
      toast({
        title: "Success",
        description: "Workspace deleted successfully",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      setcurrentWorkspace(null)
      navigate("/workspaces")
    },

    onError: () => {
      toast({
        title: "Failed",
        description: "Unable to delete workspace",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    }
  })


  useEffect(() => {
    setId(currentWorkspace?.id || "")
    setName(currentWorkspace?.name || "")
    setDescription(currentWorkspace?.description || "")
  }, [currentWorkspace])

  useEffect(() => {
    if (query.data?.data) {
      setcurrentWorkspace(query.data?.data?.data)
    }
  }, [query.data?.data])

  return (
    <>
      <Box as="section">
        <Container px={0} maxW={"8xl"}>
          <Box
            bg={"#1e1e1e"}
            boxShadow={useColorModeValue("sm", "sm-dark")}
            borderRadius="lg"
            p={{ base: "4", md: "6" }}
          >
            <Text mb={6} fontWeight="semibold" fontSize={"xl"}>Update Workspace Details</Text>
            <FormControl mb={8}>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                autoComplete='off'
              />
            </FormControl>

            <FormControl mb={8}>
              <FormLabel htmlFor="description">Description</FormLabel>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>


            <Box display={"flex"} justifyContent="left" mt={8}>
              <Button
                variant="solid"
                bgGradient='linear(to-r, orange.500, orange.600)'
                _hover={{ backgroundColor: "orange.500" }}
                _active={{ backgroundColor: "orange.500" }}
                onClick={() => {
                  mutation.mutate({
                    name,
                    description
                  })
                }}

                isLoading={mutation.isLoading}
                loadingText="Updating"
              >
                Update Workspace
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box as="section" my={6}>
        <Container px={0} maxW={"8xl"}>
          <Box
            bg={"#1e1e1e"}
            boxShadow={useColorModeValue("sm", "sm-dark")}
            borderRadius="lg"
            p={{ base: "4", md: "6" }}
          >
            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={{ base: "5", md: "6" }}
              justify="space-between"
              align={"center"}
            >
              <Stack>
                <Text fontSize="lg" fontWeight="medium">
                  Delete Workspace from your Account
                </Text>
              </Stack>
              <Box>
                <Button
                  variant="solid"
                  bg={"red.500"}
                  _hover={{ backgroundColor: "red.600" }}
                  _active={{ backgroundColor: "red.600" }}
                  onClick={onOpen}
                >
                  Delete Workspace
                </Button>
              </Box>
            </Stack>
          </Box>
        </Container>
      </Box>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg={"#1e1e1e"}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Workspace
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this workspace?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                bg={"red.500"}
                _hover={{ backgroundColor: "red.600" }}
                _active={{ backgroundColor: "red.600" }}
                onClick={() => {
                  deleteMutation.mutate()
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default GeneralSettings;
