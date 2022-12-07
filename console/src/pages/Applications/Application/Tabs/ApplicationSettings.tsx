import { useAuth0 } from "@auth0/auth0-react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { v4 } from "uuid";
import { deleteApplication, getApplication, updateApplication } from "../../../../api/applications";
import CustomWebServiceConfig from "../../../../components/TemplateConfigs/CustomWebServiceConfig";
import { currentWorkspaceState } from "../../../../store/workspaces";
export interface Variable {
  id: string
  key: string
  value: string
};


function ApplicationSettings() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast()
  const { applicationId } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const [currentWorkspace,] = useRecoilState(currentWorkspaceState);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const cancelRef = useRef<any>();
  const navigate = useNavigate();
  const query = useQuery([`application-${applicationId}`, { getAccessTokenSilently, applicationId }], getApplication)
  const queryClient = useQueryClient();

  const [variables, setVariables] = useState<Variable[]>([]);
  const [secrets, setSecrets] = useState<Variable[]>([]);
  const [config, setConfig] = useState<any>();

  const updateMutation = useMutation((data: any) => updateApplication(applicationId || "", data, getAccessTokenSilently), {
    onSuccess: () => {
      queryClient.invalidateQueries([`applications`])
      queryClient.invalidateQueries([`application-${applicationId}`])
      toast({
        title: "Success",
        description: "Application settings saved successfully",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: "Failed",
        description: "Unable to save application settings",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    }
  })

  const deleteMutation = useMutation(() => deleteApplication(applicationId || "", getAccessTokenSilently), {
    onSuccess: () => {
      queryClient.invalidateQueries([`application-${applicationId}`])
      queryClient.invalidateQueries([`applications`])
      toast({
        title: "Success",
        description: "application deleted successfully",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      navigate("workspaces/" + currentWorkspace?.name + "/applications")
    },

    onError: () => {
      toast({
        title: "Failed",
        description: "Unable to delete application",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    }
  })

  useEffect(() => {
    setName(query?.data?.data?.data?.name || "");
    setDescription(query?.data?.data?.data?.description || "");
    setVariables(query.data?.data?.data?.variables?.config_vars?.sort() || [])
    setSecrets(query.data?.data?.data?.variables?.secrets?.sort() || [])
    setConfig(query.data?.data?.data?.config || {})
  }, [query?.data?.data?.data]);

  return (
    <Box as="section">
      <Container px={0} maxW={"8xl"}>
        <Box
          bg={"#1e1e1e"}
          boxShadow={useColorModeValue("sm", "sm-dark")}
          borderRadius="lg"
          p={{ base: "4", md: "6" }}
        >

          <Text mb={8} fontWeight="medium" fontSize={"xl"}>Update Application Details</Text>
          <Stack direction={"column"} display={"flex"} alignItems={"center"}>
            <FormControl mb={4}>
              <FormLabel htmlFor={"name"}>Name</FormLabel>
              <Input
                id={"name"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
              />
            </FormControl>
            <FormControl mb={4} mt={4}>
              <FormLabel htmlFor={"description"}>Description</FormLabel>
              <Textarea id={"description"}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
          </Stack>
          {query.data?.data.data?.application_type === "WEB_SERVICE" ? <CustomWebServiceConfig config={config} setConfig={setConfig} /> : null}
          <Box mt={8}>
            <Button
              variant="solid"
              bgGradient='linear(to-r, orange.500, orange.600)'
              _hover={{ backgroundColor: "orange.500" }}
              _active={{ backgroundColor: "orange.500" }}
              onClick={() => updateMutation.mutate({
                ...query.data?.data?.data,
                name: name,
                description: description,
                config,
                variables: {
                  secrets: secrets,
                  config_vars: variables
                }
              })}
              isLoading={updateMutation.isLoading}
              loadingText="Updating"
            >
              Update Application Config
            </Button>

          </Box>
        </Box>



        <Box
          bg={"#1e1e1e"}
          boxShadow={useColorModeValue("sm", "sm-dark")}
          borderRadius="lg"
          p={{ base: "4", md: "6" }}
          mt={8}
        >
          <Box display={"flex"} flex={1} justifyContent="space-between" alignItems={"center"}>
            <Box>
              <Text fontSize="xl" fontWeight="medium">Config Variables</Text>
              <Text color="muted" fontSize="sm">
                Add your config variables here
              </Text>
            </Box>
            <Box display="flex" gap={4}>
              <Button
                variant="solid"
                bgGradient='linear(to-r, orange.500, orange.600)'
                _hover={{ backgroundColor: "orange.500" }}
                _active={{ backgroundColor: "orange.500" }}
                onClick={() => {
                  updateMutation.mutate({
                    config,
                    variables: {
                      secrets: secrets,
                      config_vars: variables
                    }
                  })
                }}
                loadingText="Updating"
                isLoading={updateMutation.isLoading}
              >
                Save
              </Button>
              <Button
                variant="solid"
                onClick={() => {
                  setVariables([...variables, { id: v4(), key: "", value: "" }]);
                }}
                loadingText="Updating"
              >
                Add New Variable
              </Button>
            </Box>
          </Box>

          {
            variables?.map((variable: Variable, index: number) => (
              <Stack key={index} direction={"row"} mt={8} gap={4} display={"flex"} alignItems={"end"}>
                <FormControl>
                  <FormLabel htmlFor={"key" + variable.id}>Key</FormLabel>
                  <Input
                    id={"key" + variable.id}
                    value={variable.key}
                    onChange={(e) => {
                      setVariables([
                        ...variables.filter((variableData: Variable) => {
                          if (variableData.id != variable.id) return variableData;
                        }),
                        {
                          id: variable.id,
                          key: e.target.value,
                          value: variable.value
                        }
                      ].sort());
                    }}
                    type="text"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor={"value" + variable.id}>Value</FormLabel>
                  <Input
                    id={"value" + variable.id}
                    value={variable.value}
                    onChange={(e) => {
                      setVariables([
                        ...variables.filter((variableData: Variable) => {
                          if (variableData.id != variable.id) return variableData;
                        }),
                        {
                          id: variable.id,
                          key: variable.key,
                          value: e.target.value
                        }
                      ].sort());
                    }}
                    type="text"
                  />
                </FormControl>
                <Box>
                  <IconButton
                    _hover={{ backgroundColor: "whiteAlpha.200" }}
                    _active={{ backgroundColor: "whiteAlpha.200" }}
                    aria-label="Options"
                    onClick={(e) => {
                      setVariables(variables.filter((variableData: Variable) => {
                        if (variableData.id != variable.id) return variableData;
                      }));
                    }}
                    icon={<MdClose size={22} />}
                    variant="solid"
                  />
                </Box>
              </Stack>
            ))
          }
        </Box>

        {
          query.data?.data.data?.template !== "SINGLE_PAGE_APPLICATION" ?
            <Box
              bg={"#1e1e1e"}
              boxShadow={useColorModeValue("sm", "sm-dark")}
              borderRadius="lg"
              p={{ base: "4", md: "6" }}
              mt={8}
            >
              <Box display={"flex"} flex={1} justifyContent="space-between" alignItems={"center"}>
                <Box>
                  <Text fontSize="xl" fontWeight="medium">Secret Variables</Text>
                  <Text color="muted" fontSize="sm">
                    Add your secret variables here
                  </Text>
                </Box>
                <Box display="flex" gap={4}>
                  <Button
                    variant="solid"
                    bgGradient='linear(to-r, orange.500, orange.600)'
                    _hover={{ backgroundColor: "orange.500" }}
                    _active={{ backgroundColor: "orange.500" }}
                    onClick={() => {
                      updateMutation.mutate({
                        config,
                        variables: {
                          secrets: secrets,
                          config_vars: variables
                        }
                      })
                    }}
                    loadingText="Updating"
                    isLoading={updateMutation.isLoading}
                  >
                    Save
                  </Button>
                  <Button
                    variant="solid"
                    onClick={() => {
                      setSecrets([...secrets, { id: v4(), key: "", value: "" }]);
                    }}
                    loadingText="Updating"
                  >
                    Add New Variable
                  </Button>
                </Box>
              </Box>

              {secrets?.map((variable: Variable, index: number) => (
                <Stack key={index} direction={"row"} mt={8} gap={4} display={"flex"} alignItems={"end"}>
                  <FormControl>
                    <FormLabel htmlFor={"key" + variable.id}>Key</FormLabel>
                    <Input
                      id={"key" + variable.id}
                      value={variable.key}
                      onChange={(e) => {
                        setSecrets([
                          ...secrets.filter((variableData: Variable) => {
                            if (variableData.id != variable.id) return variableData;
                          }),
                          {
                            id: variable.id,
                            key: e.target.value,
                            value: variable.value
                          }
                        ].sort());
                      }}
                      type="text"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor={"value" + variable.id}>Value</FormLabel>
                    <Input
                      id={"value" + variable.id}
                      value={variable.value}
                      onChange={(e) => {
                        setSecrets([
                          ...secrets.filter((variableData: Variable) => {
                            if (variableData.id != variable.id) return variableData;
                          }),
                          {
                            id: variable.id,
                            key: variable.key,
                            value: e.target.value
                          }
                        ].sort());
                      }}
                      type="text"
                    />
                  </FormControl>
                  <Box>
                    <IconButton
                      _hover={{ backgroundColor: "whiteAlpha.200" }}
                      _active={{ backgroundColor: "whiteAlpha.200" }}
                      aria-label="Options"
                      onClick={(e) => {
                        setSecrets(secrets.filter((variableData: Variable) => {
                          if (variableData.id != variable.id) return variableData;
                        }));
                      }}
                      icon={<MdClose size={22} />}
                      variant="solid"
                    />
                  </Box>
                </Stack>
              ))
              }
            </Box>

            : null
        }

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
                    Delete application from the workspace
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
                    Delete Application
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
                Delete Application
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to delete this application ?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  isLoading={deleteMutation.isLoading}
                  loadingText={"Deleting"}
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
      </Container>
    </Box>
  )
}

export default ApplicationSettings
