import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Stack,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import {
  FiCommand,
  FiDatabase,
  FiGlobe,
  FiHome,
  FiLayers,
  FiLogOut,
  FiPackage,
  FiSearch,
  FiSettings,
  FiShoppingBag,
  FiUser,
  FiZap,
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { NavButton } from "./NavButton";
import { UserProfile } from "./UserProfile";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@chakra-ui/react'

import { TbUserSearch } from "react-icons/tb";
import { useAuth0 } from "@auth0/auth0-react";
import { APP_URI } from "../../config/constants";
import { useRecoilState } from "recoil";
import { currentWorkspaceState } from "../../store/workspaces";
import UserAndWorkspacesMenu from "./UserAndWorkspacesMenu";
import CommandBar from "../CommandBar/CommandBar";
import { NavGroup } from "./NavGroup";

export const SideBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate()
  const { logout, user } = useAuth0()
  const [currentWorkspace,] = useRecoilState(currentWorkspaceState);

  return (
    <Flex
      as="section"
      bg="#1e1e1e"
      borderRight={"solid 1px"}
      borderColor="#42424252"

    >
      <Flex
        flex="1"
        bg="#1e1e1e"
        py={{ base: "8", sm: "8" }}
        px={{ base: "4", sm: "4" }}
      >
        <Stack justify="space-between" spacing="1" data-tauri-drag-region>
          <Stack spacing={6} shouldWrapChildren>
            <Box mb={2} display="flex" justifyContent={"center"} alignItems={"center"}>
              <Image src="/faasbase.svg" width={10} height={10} />
            </Box>
            <Stack spacing="4" justifyContent={"center"} alignItems={"center"}>
              {currentWorkspace ? <>
                <NavButton
                  as={NavLink}
                  to={"workspaces/" + currentWorkspace?.name + "/dashboard"}
                  label="Dashboard"
                  icon={FiHome}
                />
                <NavGroup label="DEVELOP">
                  <NavButton
                    as={NavLink}
                    to={"workspaces/" + currentWorkspace?.name + "/applications"}
                    label="Applications"
                    icon={FiPackage}
                  />
                  <NavButton
                    as={NavLink}
                    to={"workspaces/" + currentWorkspace?.name + "/functions"}
                    label="Functions"
                    icon={FiCommand}
                  />
                  <NavButton
                    as={NavLink}
                    to={"workspaces/" + currentWorkspace?.name + "/databases"}
                    label="Database"
                    icon={FiDatabase}
                  />
                </NavGroup>
                <NavGroup label="Collab">
                  <NavButton
                    as={NavLink}
                    to="/marketplace"
                    label="Marketplace"
                    icon={FiShoppingBag}
                  />
                  <NavButton
                    as={NavLink}
                    to={"/experts"}
                    label="Faasbase Experts"
                    icon={TbUserSearch}
                  />
                </NavGroup>

                
              </> : <>
                <NavButton
                  as={NavLink}
                  to={"/workspaces"}
                  label="Workspaces"
                  icon={FiLayers}
                />
                <NavButton
                  as={NavLink}
                  to="/marketplace"
                  label="Marketplace"
                  icon={FiShoppingBag}
                />
              </>}

            </Stack>
          </Stack>
          <Stack spacing={{ base: "5", sm: "6" }} alignItems={"center"}>
            {/* <CommandBar /> */}
            <UserAndWorkspacesMenu />
          </Stack>
        </Stack>
      </Flex>
    </Flex>
  );
};
