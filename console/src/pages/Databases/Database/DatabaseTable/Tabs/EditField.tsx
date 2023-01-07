
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import { editCollaboratorFunction } from "../../../../../api/functions";
import { updateField } from "../../../../../api/databases";

interface EditFieldProp {
  field: any;
  isOpen: boolean;
  onClose: () => void;
}

export function EditField(props: EditFieldProp) {
  const { tableId, databaseId } = useParams();
  const { onClose, isOpen, field } = props;
  const { getAccessTokenSilently, getIdTokenClaims } = useAuth0()
  const toast = useToast();
  const [dataType, setDataType] = useState("INT");
  const [name, setName] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC");
  const [defaultValue, setDefaultValue] = useState("0");
  const [refereceTable, setReferenceTable] = useState("");
  const [refereceField, setRefereceField] = useState("");
  const queryClient = useQueryClient();

  const updateFieldMutation = useMutation((data: any) => updateField(data, getAccessTokenSilently), {
    onSuccess: () => {
      queryClient.invalidateQueries([`databases-${databaseId}-tables-${tableId}-fields`])
      toast({
        title: "Success",
        description: "Field updated successfully",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      setName("");
      setRefereceField("");
      setDefaultValue("");
      setReferenceTable("");
      setDataType("");
      setVisibility("PUBLIC");
      props.onClose()
    },
    onError: () => {
      toast({
        title: "Failed",
        description: "Unable to update Field",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    }
  })
  useEffect(() => {
    setDataType(field?.data_type);
    setName(field?.name);
    setVisibility(field?.visibility);
    setRefereceField(field?.relationship_config?.reference_field || "")
    setReferenceTable(field?.relationship_config?.reference_table || "")
    setDefaultValue(field?.default_value);
  }, [field])
  return (
    <>

      <Modal isOpen={isOpen} onClose={onClose} size="lg" >
        <ModalOverlay />
        <ModalContent bg={"#1e1e1e"}>
          <ModalHeader>Edit Field</ModalHeader>
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
                <option value="INT">Integer</option>
                <option value="FLOAT">Float</option>
                <option value="VARCHAR">Varchar</option>
                <option value="RELATIONSHIP">Relationship</option>
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
            {
              dataType == "RELATIONSHIP" && <FormControl mb={8}>
              <FormLabel htmlFor="reference-table">Reference Table</FormLabel>
              <Select
                id="reference-table"
                border={"2px"}
                onChange={(e) => setReferenceTable(e.target.value)}
                value={refereceTable}
              >
                <option value={""}>None</option>
                <option value={"1"}>Table1</option>
                
              </Select>
            </FormControl>
            }
            
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
                  </Select>
                </FormControl>
              )
            }
          </ModalBody>

          <ModalFooter>
            <Button variant='solid' colorScheme={"gray"} mr={3} onClick={() => onClose()}>
              Cancel
            </Button>
            <Button
              isLoading={updateFieldMutation.isLoading}
              loadingText={"Updating"}
              onClick={() => {
                updateFieldMutation.mutate({
                  name:name,
                  data_type:dataType,
                  visibility:visibility,
                  default_value:defaultValue,
                  relationship_config: (dataType == "RELATIONSHIP" ? {
                    "current_table": tableId,
                    "reference_table": refereceTable,
                    "reference_field": refereceField
                  }:{}),
                  table_id: tableId,
                  database_id: databaseId,
                  id: field?.id
                })
              }}
              variant="solid"
              bgGradient='linear(to-r, orange.500, orange.600)'
              _hover={{ backgroundColor: "orange.500" }}
              _active={{ backgroundColor: "orange.500" }}
            >
              Update Field
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
