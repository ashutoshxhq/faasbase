import { useAuth0 } from "@auth0/auth0-react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Stack,
  Text,
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
import { currentWorkspaceState } from "../../../../store/workspaces";
export interface Variable {
  id: string
  key: string
  value: string
};


function ApplicationVariables() {
  const toast = useToast()
  const { applicationId } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const query = useQuery([`application-${applicationId}`, { getAccessTokenSilently, applicationId }], getApplication)
  const queryClient = useQueryClient();

  const [variables, setVariables] = useState<Variable[]>([]);
  const [secrets, setSecrets] = useState<Variable[]>([]);

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

  useEffect(() => {
    setVariables(query.data?.data?.data?.variables?.config_vars?.sort() || [])
    setSecrets(query.data?.data?.data?.variables?.secrets?.sort() || [])
  }, [query?.data?.data?.data]);

  return (
    <Box as="section">
      <Container px={0} maxW={"full"}>

        <Box
          bg={"#1e1e1e"}
          boxShadow={useColorModeValue("sm", "sm-dark")}
          borderRadius="lg"
          p={{ base: "4", md: "6" }}
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
        <Box display={"flex"} justifyContent="end" py="8">
          <Button
            variant="solid"
            bgGradient='linear(to-r, orange.500, orange.600)'
            _hover={{ backgroundColor: "orange.500" }}
            _active={{ backgroundColor: "orange.500" }}
            onClick={() => {
              updateMutation.mutate({
                variables: {
                  secrets: secrets,
                  config_vars: variables
                }
              })
            }}
            loadingText="Updating"
            isLoading={updateMutation.isLoading}
          >
            Update Variables
          </Button>

        </Box>


      </Container>
    </Box>
  )
}

export default ApplicationVariables
