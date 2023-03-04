import { useAuth0 } from '@auth0/auth0-react';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Container, FormControl, FormLabel, Input, Stack, Text, Textarea, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'
import { getFunction, updateFunction } from '../../../../api/functions';
import { FiEdit, FiSave } from 'react-icons/fi';
import { useEffect, useState } from 'react';

const FunctionOverview = () => {
  const toast = useToast()
  const { functionId } = useParams();
  const {getAccessTokenSilently} = useAuth0();
  const [editMode, setEditMode] = useState(false);
  const [readme, setReadme] = useState("");
  const queryClient = useQueryClient();

  const query = useQuery([`functions-${functionId}`,{ getAccessTokenSilently, functionId }], getFunction)
  useEffect(() => {
    setReadme(query?.data?.data?.data?.readme)
  },[query?.data?.data?.data?.readme])

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
      setEditMode(false);

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
      setEditMode(false);
    }

    
  })
  return (
    <Box>
      <Box as="section" data-tauri-drag-region>
        <Stack spacing="5">
          <Stack
            data-tauri-drag-region
            spacing="4"
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
            alignItems={"center"}
          >
            <Box display="flex" gap={4} justifyContent={"center"} alignItems={"center"}>
              {/* <FiCommand size={"40px"} /> */}
              <Box>
                <Text fontSize="2xl" fontWeight="medium">
                  Overview
                </Text>
              </Box>
            </Box>
            <Stack direction="row">
              {
                editMode ? (
                  <Button 
                    variant="solid"
                    bgGradient='linear(to-r, orange.500, orange.600)'
                    _hover={{ backgroundColor: "orange.500" }}
                    _active={{ backgroundColor: "orange.500" }}
                    onClick={() => {
                      mutation.mutate({
                        name: query?.data?.data?.data?.name,
                        readme: readme,
                      })
                    }}

                    isLoading={mutation.isLoading}
                    loadingText="Updating"
                  >
                    <FiSave/>&nbsp;&nbsp; Save
                  </Button>
                ):(
                  <Button
                  
                   onClick={(e) => setEditMode(true)}  variant="solid" bgGradient='linear(to-r, orange.500, orange.600)' _hover={{ backgroundColor: "orange.500" }} _active={{ backgroundColor: "orange.500" }}>
                    <FiEdit/>&nbsp;&nbsp; Edit
                  </Button>
                )
              }
            </Stack>
          </Stack>
        </Stack>
      </Box>
      {
        editMode ? (
          <Textarea
            id="description"
            border={"solid 1px #42424252"}
            py={4} 
            px={4} 
            mt={4}
            minHeight={"calc(100vh - 300px)"}
            borderRadius={"5px"}
            value={readme}
            onChange={(e) => setReadme(e.target.value)}
          />
        ):(
          <Box as="section" py={4} px={4} mt={4} minHeight={"calc(100vh - 300px)"} borderRadius={"5px"} border={"solid 1px #42424252"}data-tauri-drag-region>
            <ReactMarkdown children={readme} />
          </Box>
        )
      }
      
    </Box>
  )
}

export default FunctionOverview