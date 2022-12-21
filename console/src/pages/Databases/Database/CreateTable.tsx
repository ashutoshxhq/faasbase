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
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { stringify } from "uuid";
import { createTable } from "../../../api/databases";
import { createFunction } from "../../../api/functions";
import { CustomSelect, Option } from "../../../components/CustomSelect/CustomSelect";
import { currentWorkspaceState } from "../../../store/workspaces";

interface CreateFunctionProp {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTable(props: CreateFunctionProp) {
  const {databaseId} = useParams();
  const toast = useToast();
  const [tableName, setTableName] = useState("");
  const [tableDescription, setTableDescription] = useState("");
  const [tableReadme, setTableReadme] = useState("");
  const { getAccessTokenSilently, getIdTokenClaims } = useAuth0();
  const [currentWorkspace,] = useRecoilState(currentWorkspaceState);
  const queryClient = useQueryClient()

  const createTableMutation = useMutation((data: any) => createTable(data, getAccessTokenSilently), {
    onSuccess: () => {
      queryClient.invalidateQueries([`databases-${databaseId}-tables`])
      toast({
        title: "Success",
        description: "Table created successfully",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      props.onClose()
      setTableDescription("");
      setTableName("");
      setTableReadme("");
    },

    onError: () => {
      toast({
        title: "Failed",
        description: "Unable to create Table",
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
          <DrawerHeader data-tauri-drag-region>Create New Table</DrawerHeader>
          <DrawerBody>
            <FormControl isRequired mt={8}>
              <FormLabel htmlFor="name"> Name</FormLabel>
              <Input
                id="name"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired mt={8}>
              <FormLabel htmlFor="description">Description</FormLabel>
              <Textarea
                id="description"
                value={tableDescription}
                onChange={(e) => setTableDescription(e.target.value)}
                placeholder="Write your description here..."
              />
            </FormControl>
            <FormControl isRequired mt={8}>
              <FormLabel htmlFor="readme">Readme</FormLabel>
              <Textarea
                id="readme"
                value={tableReadme}
                onChange={(e) => setTableReadme(e.target.value)}
                placeholder="Write your readme here..."
              />
            </FormControl>
          </DrawerBody>
          <DrawerFooter>
            <Button variant='solid' colorScheme={"gray"} mr={3} onClick={() => props?.onClose()}>
              Cancel
            </Button>
            <Button
              isLoading={createTableMutation.isLoading}
              loadingText={"Creating"}
              onClick={() => {
                createTableMutation.mutate({
                  name: tableName,
                  description: tableDescription,
                  readme: tableReadme,
                  database_id: databaseId,
                })
              }}
              variant="solid"
              bgGradient='linear(to-r, orange.500, orange.600)'
              _hover={{ backgroundColor: "orange.500" }}
              _active={{ backgroundColor: "orange.500" }}
            >
              Create 
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
