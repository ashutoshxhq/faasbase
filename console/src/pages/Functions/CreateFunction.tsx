import { useAuth0 } from "@auth0/auth0-react";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { createFunction } from "../../api/functions";
import { CustomSelect, Option } from "../../components/CustomSelect/CustomSelect";
import { currentWorkspaceState } from "../../store/workspaces";

interface CreateFunctionProp {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateFunction(props: CreateFunctionProp) {
  const toast = useToast();
  const [functionName, setFunctionName] = useState("");
  const [functionDesc, setFunctionDesc] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC")
  const { getAccessTokenSilently, getIdTokenClaims } = useAuth0();
  const [currentWorkspace,] = useRecoilState(currentWorkspaceState);
  const queryClient = useQueryClient()

  const createFunctionMutation = useMutation((data: any) => createFunction(data, getAccessTokenSilently), {
    onSuccess: () => {
      queryClient.invalidateQueries([`functions`])
      toast({
        title: "Success",
        description: "Function created successfully",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      props.onClose()
      setFunctionName("")
      setFunctionDesc("")
    },

    onError: () => {
      toast({
        title: "Failed",
        description: "Unable to create Function",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    }
  })

  return (
    <>
      <Drawer isOpen={props.isOpen} onClose={props.onClose} size="lg" >
        <DrawerOverlay />
        <DrawerContent mx={"23px"} my={"53px"} borderRadius={"8px"} bg={"#1e1e1e"} overflowY={"scroll"}>
          <DrawerCloseButton />
          <DrawerHeader data-tauri-drag-region>Create New Function</DrawerHeader>
          <DrawerBody>
            <FormControl isRequired mt={8}>
              <FormLabel htmlFor="function-name">Function Name</FormLabel>
              <Input
                id="function-name"
                value={functionName}
                onChange={(e) => setFunctionName(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired mt={8}>
              <FormLabel htmlFor="function-desc">Function Description</FormLabel>
              <Textarea
                id="function-desc"
                value={functionDesc}
                onChange={(e) => setFunctionDesc(e.target.value)}
                placeholder="Write your function description here..."
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

          </DrawerBody>
          <DrawerFooter>
            <Button variant='solid' colorScheme={"gray"} mr={3} onClick={() => props?.onClose()}>
              Cancel
            </Button>
            <Button

              isLoading={createFunctionMutation.isLoading}
              loadingText={"Creating"}
              onClick={() => {
                createFunctionMutation.mutate({
                  name: functionName,
                  description: functionDesc,
                  visibility,
                  workspace_id: currentWorkspace?.id
                })
              }}
              variant="solid"
              bgGradient='linear(to-r, orange.500, orange.600)'
              _hover={{ backgroundColor: "orange.500" }}
              _active={{ backgroundColor: "orange.500" }}
            >
              Create Function
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
