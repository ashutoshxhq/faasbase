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
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { createDatabase } from "../../api/databases";
import { createFunction } from "../../api/functions";
import { CustomSelect, Option } from "../../components/CustomSelect/CustomSelect";
import { currentWorkspaceState } from "../../store/workspaces";

interface CreateDatabaseProp {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateDatabase(props: CreateDatabaseProp) {
  const toast = useToast();
  const [databaseDetails, setDatabaseDetails] = useState({
    hostname:"",
    username:"",
    password:"",
    port:"3306",
    name:"",
    database_type:"",
  });
  
  const { getAccessTokenSilently, getIdTokenClaims } = useAuth0();
  const [currentWorkspace,] = useRecoilState(currentWorkspaceState);
  const queryClient = useQueryClient()
  const createDatabaseMutation = useMutation((data: any) => createDatabase(data, getAccessTokenSilently), {
    onSuccess: () => {
      queryClient.invalidateQueries([`databases`])
      toast({
        title: "Success",
        description: "Table created successfully",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      props.onClose()
      setDatabaseDetails({    
      hostname:"",
      username:"",
      password:"",
      port:"3306",
      name:"",
      database_type:"",})
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
          <DrawerHeader data-tauri-drag-region>Create New Database</DrawerHeader>
          <DrawerBody>
            <FormControl isRequired>
              <FormLabel htmlFor="database-name">Database Name</FormLabel>
              <Input
                id="database-name"
                value={databaseDetails.name}
                onChange={(e) => setDatabaseDetails({...databaseDetails,name:e.target.value})}
              />
            </FormControl>
            <FormControl isRequired mt={8}>
              <FormLabel htmlFor="database-hostname">Host Name</FormLabel>
              <Input
                id="database-hostname"
                value={databaseDetails.hostname}
                onChange={(e) => setDatabaseDetails({...databaseDetails,hostname:e.target.value})}
              />
            </FormControl>
            <FormControl isRequired mt={8}>
              <FormLabel htmlFor="database-username">Username</FormLabel>
              <Input
                id="database-username"
                value={databaseDetails.username}
                onChange={(e) => setDatabaseDetails({...databaseDetails,username:e.target.value})}
              />
            </FormControl>
            <FormControl isRequired mt={8}>
              <FormLabel htmlFor="database-password">Password</FormLabel>
              <Input
                type="password"
                id="database-password"
                value={databaseDetails.password}
                onChange={(e) => setDatabaseDetails({...databaseDetails,password:e.target.value})}
              />
            </FormControl>
            <FormControl isRequired mt={8}>
              <FormLabel htmlFor="database-port">Port</FormLabel>
              <Input
                id="database-port"
                type="number"
                value={databaseDetails.port}
                onChange={(e) => setDatabaseDetails({...databaseDetails,port:e.target.value})}
              />
            </FormControl>
            <FormControl isRequired mt={8}>
              <FormLabel htmlFor="database-type">Database Type</FormLabel>
              <Select
                id="database-type"
                onChange={(e) => setDatabaseDetails({...databaseDetails,database_type:e.target.value})}
                value={databaseDetails.database_type}
              >
                <option disabled value="">None</option>
                <option value="MONOGODB">Mongo Db</option>
                <option value="MYSQL">MySql</option>
                <option value="POSTGRES">Postgres</option>
              </Select>
            </FormControl>
          </DrawerBody>
          <DrawerFooter>
            <Button variant='solid' colorScheme={"gray"} mr={3} onClick={() => props?.onClose()}>
              Cancel
            </Button>
            <Button
              isLoading={createDatabaseMutation.isLoading}
              loadingText={"Creating"}
              onClick={() => {
                createDatabaseMutation.mutate({
                  ...databaseDetails,
                  workspace_id: currentWorkspace?.id
                })
              }}
              variant="solid"
              bgGradient='linear(to-r, orange.500, orange.600)'
              _hover={{ backgroundColor: "orange.500" }}
              _active={{ backgroundColor: "orange.500" }}
            >
              Create Database
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
