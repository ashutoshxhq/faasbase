
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { currentWorkspaceState } from "../../../../../store/workspaces";
import { useRecoilState } from "recoil";
import { getCurrentWorkspaceMembers } from "../../../../../api/workspaces";
import { getFields, getTables } from "../../../../../api/databases";

interface AddFieldProp {
  isOpen: boolean;
  onClose: () => void;
}

export function AddField(props: AddFieldProp) {
  const { tableId, databaseId } = useParams();
  const { getAccessTokenSilently, getIdTokenClaims } = useAuth0()
  const toast = useToast();
  const [fieldId, setFieldId] = useState("");
  const [dataType, setDataType] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC");
  const [defaultValue, setDefaultValue] = useState("");
  const [refereceTable, setReferenceTable] = useState("");
  const [refereceField, setRefereceField] = useState("");
  const [name, setName] = useState("");

  const tables = useQuery([`databases-${databaseId}-tables`, { getAccessTokenSilently, databaseId }], getTables)
  const fields = useQuery([`databases-${databaseId}-tables-${refereceTable}-fields`, { getAccessTokenSilently, databaseId, refereceTable }], getFields)

  const queryClient = useQueryClient();
  // const addFieldMutation = useMutation(() => {
  //   return addFieldFunction(tableId || "", collaboratorId, permission, getAccessTokenSilently)
  // }, {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries([`table-${tableId}-field`])
  //     toast({
  //       title: "Success",
  //       description: "Field added successfully",
  //       status: "success",
  //       position: "bottom-right",
  //       duration: 5000,
  //       isClosable: true,
  //     });
  //     props.onClose()
  //   },

  //   onError: () => {
  //     toast({
  //       title: "Failed",
  //       description: "Unable to add field",
  //       status: "error",
  //       position: "bottom-right",
  //       duration: 5000,
  //       isClosable: true,
  //     });
  //   }
  // })
  useEffect (() => {
    queryClient.invalidateQueries([`databases-${databaseId}-tables-${refereceTable}-fields`])
  },[refereceTable])
  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose} size="lg" >
        <ModalOverlay />
        <ModalContent bg={"#1e1e1e"}>
          <ModalHeader>Add New Field</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <FormControl isRequired mb={8}>
              <FormLabel htmlFor="name">Field Name</FormLabel>
              <Input 
                id="name"
                border={"2px"}
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)} 
              />
            </FormControl>
            
            <FormControl isRequired mb={8}>
              <FormLabel htmlFor="datatype">Field Data Type</FormLabel>
              <Select
                id="datatype"
                border={"2px"}
                onChange={(e) => setDataType(e.target.value)}
                value={dataType}
              >
                <option disabled value={""}>None</option>
                <option value="INT">Integer</option>
                <option value="FLOAT">Float</option>
                <option value="VARCHAR">Varchar</option>
              </Select>
            </FormControl>
            <FormControl mb={8}>
              <FormLabel htmlFor="default-value">Default Value</FormLabel>
              <Input 
                id="default-value"
                border={"2px"}
                placeholder="Default value"
                value={defaultValue}
                onChange={(e) => setDefaultValue(e.target.value)} 
              />
            </FormControl>
            <FormControl isRequired mb={8}>
              <FormLabel htmlFor="visibility">Visibility</FormLabel>
              <Select
                id="visibility"
                border={"2px"}
                onChange={(e) => setVisibility(e.target.value)}
                value={visibility}
              >
                <option value={"PUBLIC"}>Public</option>
                <option value={"PRIVATE"}>Private</option>
                
              </Select>
            </FormControl>
            <FormControl  mb={8}>
              <FormLabel htmlFor="reference-table">Reference Table</FormLabel>
              <Select
                id="reference-table"
                border={"2px"}
                onChange={(e) => setReferenceTable(e.target.value)}
                value={refereceTable}
              >
                <option value={""}>None</option>
                {
                  tables?.data?.data?.data?.map((t: any) => t.id != tableId && <option value={t?.id}>{t?.name}</option>)
                }
              </Select>
            </FormControl>

            {
              (refereceTable && (refereceTable.trim() !== "")) && (
                <FormControl isRequired={(refereceTable && (refereceTable.trim() !== "")) ? true: false} mb={8}>
                  <FormLabel htmlFor="reference-field">Reference Field</FormLabel>
                  <Select
                    id="reference-field"
                    border={"2px"}
                    onChange={(e) => setRefereceField(e.target.value)}
                    value={refereceField}
                  >
                    <option disabled value={""}>None</option>
                    {
                      fields?.data?.data?.data?.map((f: any) => <option value={f?.id}>{f?.name}</option>)
                    }
                  </Select>
                </FormControl>
              )
            }
            
          </ModalBody>

          <ModalFooter>
            <Button variant='solid' colorScheme={"gray"} mr={3} onClick={() => props?.onClose()}>
              Cancel
            </Button>
            <Button
              // isLoading={addFieldMutatation.isLoading}
              loadingText={"Creating"}
              // onClick={() => { addFieldMutatation.mutate() }}
              variant="solid"
              bgGradient='linear(to-r, orange.500, orange.600)'
              _hover={{ backgroundColor: "orange.500" }}
              _active={{ backgroundColor: "orange.500" }}
            >
              Add Field
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
