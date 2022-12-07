
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

interface EditFieldProp {
  field: any;
  isOpen: boolean;
  onClose: () => void;
}

export function EditField(props: EditFieldProp) {
  const { tableId } = useParams();
  const { onClose, isOpen, field } = props;
  const { getAccessTokenSilently, getIdTokenClaims } = useAuth0()
  const toast = useToast();
  const [fieldId, setFieldId] = useState("");
  const [dataType, setDataType] = useState("");
  const [name, setName] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC");
  const [defaultValue, setDefaultValue] = useState("");
  const [refereceTable, setReferenceTable] = useState("");
  const [refereceField, setRefereceField] = useState("");
  const queryClient = useQueryClient();

  // const editFieldMutation = useMutation((data: any) => {
  //   return editFieldFunction(tableId || "", fieldId, data, getAccessTokenSilently)
  // }, {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries([`table-${tableId}-fields`])
  //     toast({
  //       title: "Success",
  //       description: "Field updated successfully",
  //       status: "success",
  //       position: "bottom-right",
  //       duration: 5000,
  //       isClosable: true,
  //     });
  //     onClose()
  //   },

  //   onError: () => {
  //     toast({
  //       title: "Failed",
  //       description: "Unable to update field",
  //       status: "error",
  //       position: "bottom-right",
  //       duration: 5000,
  //       isClosable: true,
  //     });
  //   }
  // })
  useEffect(() => {
    setFieldId(field?.id);
    setDataType(field?.dataType);
    setName(field?.name);
    setVisibility(field?.visibility);
    setRefereceField(field?.refereceField || "")
    setReferenceTable(field?.refereceTable || "")
    setDefaultValue(field?.default);
  }, [])
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
            <FormControl mb={8}>
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
              // isLoading={editFieldMutation.isLoading}
              loadingText={"Updating"}
              onClick={() => {
                // editFieldMutation.mutate({
                //   function_id: field.function_id,
                //   collaborator_id: field.collaborator_id,
                //   permission
                // })
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
