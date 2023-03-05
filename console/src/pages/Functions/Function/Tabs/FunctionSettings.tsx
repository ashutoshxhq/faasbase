import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Container, FormControl, FormLabel, Input, Stack, Text, Textarea, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteFunction, getFunction, updateFunction } from '../../../../api/functions';
import { CustomSelect, Option } from '../../../../components/CustomSelect/CustomSelect';

const FunctionSettings = (props: any) => {
  const { functionId } = useParams();
  const [functionName, setFunctionName] = useState("");
  const [functionDescription, setFunctionDescription] = useState("");
  const [visibility, setVisibility] = useState("PRIVATE")
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast()
  const cancelRef = React.useRef<any>();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient()
  const query = useQuery([`function-${functionId}`, { getAccessTokenSilently, functionId }], getFunction)
  const mutation = useMutation((data: any) => updateFunction(functionId || "", data, getAccessTokenSilently), {
    onSuccess: () => {
      queryClient.invalidateQueries([`function-${functionId}`])
      queryClient.invalidateQueries([`functions`])
      toast({
        title: "Success",
        description: "Function updated successfully",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
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

  const deleteMutation = useMutation(() => deleteFunction(functionId || "", getAccessTokenSilently), {
    onSuccess: () => {
      queryClient.invalidateQueries([`function-${functionId}`])
      queryClient.invalidateQueries([`functions`])
      toast({
        title: "Success",
        description: "Function deleted successfully",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      navigate("/functions")
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
    if (query.data?.data) {
      setFunctionName(query.data?.data?.data?.name || "")
      setFunctionDescription(query.data?.data?.data?.description || "")
      setVisibility(query.data?.data?.data?.visibility || "PUBLIC")
    }
  }, [query.data])


  return (
    <>
      <Box as="section">
        <Container px={0} maxW={"full"}>
          <Box
            bg={"#1e1e1e"}
            boxShadow={useColorModeValue("sm", "sm-dark")}
            borderRadius="lg"
            p={{ base: "4", md: "6" }}
          >
            <Text mb={6} fontWeight="semibold" fontSize={"xl"}>Update Funtion Details</Text>
            <FormControl mb={8}>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                id="name"
                value={functionName}
                onChange={(e) => setFunctionName(e.target.value)}
                type="text"
                autoComplete='off'
              />
            </FormControl>

            <FormControl mb={8}>
              <FormLabel htmlFor="description">Description</FormLabel>
              <Textarea
                id="description"
                value={functionDescription}
                onChange={(e) => setFunctionDescription(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired mt={8}>
              <FormLabel htmlFor="function-desc">Visibility</FormLabel>
              <CustomSelect value={visibility} onChange={(val) => {
                setVisibility(val)
              }}>
                <Option value={"PUBLIC"}>Public Function</Option>
                <Option value={"PRIVATE"}>Private Function</Option>
              </CustomSelect>
            </FormControl>

            <Box display={"flex"} justifyContent="left" mt={8}>
              <Button
                variant="solid"
                bgGradient='linear(to-r, orange.500, orange.600)'
                _hover={{ backgroundColor: "orange.500" }}
                _active={{ backgroundColor: "orange.500" }}
                onClick={() => {
                  mutation.mutate({
                    name: functionName,
                    description: functionDescription,
                    visibility,
                  })
                }}

                isLoading={mutation.isLoading}
                loadingText="Updating"
              >
                Update Function
              </Button>
            </Box>
          </Box>
        </Container>
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
                  Delete Function from your Account
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
                  Delete Function
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
              Delete Function
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this function ?
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
    </>

  )
}

export default FunctionSettings