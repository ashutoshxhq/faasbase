
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
import { getUsers } from "../../../../api/users";
import { addCollaboratorFunction } from "../../../../api/functions";
import { currentWorkspaceState } from "../../../../store/workspaces";
import { useRecoilState } from "recoil";
import { getCurrentWorkspaceMembers } from "../../../../api/workspaces";

interface AddCollaboratorProp {
  isOpen: boolean;
  onClose: () => void;
}

export function AddCollaborator(props: AddCollaboratorProp) {
  const { functionId } = useParams();
  const { getAccessTokenSilently, getIdTokenClaims } = useAuth0()
  const toast = useToast();
  const [collaboratorId, setCollaboratorId] = useState("");
  const [permission, setPermission] = useState("");
  const [currentWorkspace,] = useRecoilState(currentWorkspaceState);

  const workspaceMembersQuery = useQuery([`workspace-members`, { getAccessTokenSilently, currentWorkspace }], getCurrentWorkspaceMembers)
  const queryClient = useQueryClient();
  const addCollaboratorMutation = useMutation(() => {
    return addCollaboratorFunction(functionId || "", collaboratorId, permission, getAccessTokenSilently)
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries([`function-${functionId}-collaborators`])
      toast({
        title: "Success",
        description: "Collaborator added successfully",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      props.onClose()
    },

    onError: () => {
      toast({
        title: "Failed",
        description: "Unable to add collaborator",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    }
  })
  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose} size="lg" >
        <ModalOverlay />
        <ModalContent bg={"#1e1e1e"}>
          <ModalHeader>Add New Collaborator</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired mb={8}>
              <FormLabel htmlFor="user">Workspace Member</FormLabel>
              <Select
                id="user"
                border={"2px"}
                placeholder="User"
                onChange={(e) => setCollaboratorId(e.target.value)}
              >
                {
                  workspaceMembersQuery?.data?.data?.data.map((u: any, index: number) =>
                    <option value={u.user_id} key={u.user_id}>{u.firstname}{" "}{u.lastname} </option>
                  )
                }
              </Select>
            </FormControl>
            <FormControl isRequired mb={8}>
              <FormLabel htmlFor="permission">Permissions</FormLabel>
              <Select
                id="permission"
                border={"2px"}
                placeholder="Permission"
                onChange={(e) => setPermission(e.target.value)}
              >
                <option value="READ">Read</option>
                <option value="READ_WRITE">Read Write</option>
                <option value="OWNER">Owner</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant='solid' colorScheme={"gray"} mr={3} onClick={() => props?.onClose()}>
              Cancel
            </Button>
            <Button
              isLoading={addCollaboratorMutation.isLoading}
              loadingText={"Creating"}
              onClick={() => { addCollaboratorMutation.mutate() }}
              variant="solid"
              bgGradient='linear(to-r, orange.500, orange.600)'
              _hover={{ backgroundColor: "orange.500" }}
              _active={{ backgroundColor: "orange.500" }}
            >
              Add Collaborator
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
