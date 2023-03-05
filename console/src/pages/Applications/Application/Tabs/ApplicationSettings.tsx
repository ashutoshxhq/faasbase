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
import { CustomSelect, Option } from "../../../../components/CustomSelect/CustomSelect";
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
  const [visibility, setVisibility] = useState("PRIVATE")
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
      navigate("/workspaces/" + currentWorkspace?.name + "/applications")
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
    setVisibility(query?.data?.data?.data?.visibility || "PUBLIC")
    setVariables(query.data?.data?.data?.variables?.config_vars?.sort() || [])
    setSecrets(query.data?.data?.data?.variables?.secrets?.sort() || [])
    setConfig(query.data?.data?.data?.config || {})
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

          <Text mb={8} fontWeight="medium" fontSize={"xl"}>Update Application Details</Text>
          <Stack direction={"column"} display={"flex"} alignItems={"start"}>
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
            <Box w={"40%"}>
              <FormControl isRequired mt={8}>
                <FormLabel htmlFor="function-desc">Visibility</FormLabel>
                <CustomSelect value={visibility} onChange={(val) => {
                  setVisibility(val)
                }}>
                  <Option value={"PUBLIC"}>Public</Option>
                  <Option value={"PRIVATE"}>Private</Option>
                </CustomSelect>
              </FormControl>
            </Box>

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
                visibility: visibility,
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


        <Box as="section" my={6}>
          <Container px={0} maxW={"full"}>
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
