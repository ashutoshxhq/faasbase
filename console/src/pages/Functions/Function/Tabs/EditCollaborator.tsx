
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
import { editCollaboratorFunction } from "../../../../api/functions";

interface EditCollaboratorProp {
  collaborator: any;
  isOpen: boolean;
  onClose: () => void;
}

export function EditCollaborator(props: EditCollaboratorProp) {
  const { functionId } = useParams();
  const { onClose, isOpen, collaborator } = props;
  const { getAccessTokenSilently, getIdTokenClaims } = useAuth0()
  const toast = useToast();
  const [collaboratorId, setCollaboratorId] = useState("");
  const [permission, setPermission] = useState("");
  const queryClient = useQueryClient();

  const editCollaboratorMutation = useMutation((data: any) => {
    return editCollaboratorFunction(functionId || "", collaboratorId, data, getAccessTokenSilently)
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries([`function-${functionId}-collaborators`])
      toast({
        title: "Success",
        description: "Permission updated successfully",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      onClose()
    },

    onError: () => {
      toast({
        title: "Failed",
        description: "Unable to update permissions",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    }
  })
  useEffect(() => {
    setCollaboratorId(collaborator.id);
    setPermission(collaborator.permission)
  }, [collaborator])
  return (
    <>

      <Modal isOpen={isOpen} onClose={onClose} size="lg" >
        <ModalOverlay />
        <ModalContent bg={"#1e1e1e"}>
          <ModalHeader>Edit Collaborator Permission</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired mb={8}>
              <FormLabel htmlFor="permission">Permission</FormLabel>
              <Select
                id="permission"
                border={"2px"}
                placeholder="Permission"
                onChange={(e) => setPermission(e.target.value)}
                value={permission}
              >
                <option value="READ">Read</option>
                <option value="READ_WRITE">Read Write</option>
                <option value="OWNER">Owner</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant='solid' colorScheme={"gray"} mr={3} onClick={() => onClose()}>
              Cancel
            </Button>
            <Button
              isLoading={editCollaboratorMutation.isLoading}
              loadingText={"Updating"}
              onClick={() => {
                editCollaboratorMutation.mutate({
                  function_id: collaborator.function_id,
                  collaborator_id: collaborator.collaborator_id,
                  permission
                })
              }}
              variant="solid"
              bgGradient='linear(to-r, orange.500, orange.600)'
              _hover={{ backgroundColor: "orange.500" }}
              _active={{ backgroundColor: "orange.500" }}
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
