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

import { useAuth0 } from "@auth0/auth0-react";
import { APP_URI } from "../../config/constants";
import { useRecoilState } from "recoil";
import { currentWorkspaceState } from "../../store/workspaces";
import WorkspacesMenu from "./WorkspacesMenu";
import CommandBar from "../CommandBar/CommandBar";

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
        px={{ base: "6", sm: "6" }}
      >
        <Stack justify="space-between" spacing="1" data-tauri-drag-region>

          <Stack spacing={{ base: "5", sm: "6" }} shouldWrapChildren>
            <Box mb={2} display="flex" justifyContent={"center"} alignItems={"center"}>
              <Image src="/faasly.svg" width={10} height={10} />
            </Box>
            <Stack spacing="4">
              {currentWorkspace ? <>
                <NavButton
                  as={NavLink}
                  to={"workspaces/" + currentWorkspace?.name + "/dashboard"}
                  label="Dashboard"
                  icon={FiHome}
                />
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
                <NavButton
                  as={NavLink}
                  to="/marketplace"
                  label="Marketplace"
                  icon={FiShoppingBag}
                />
                <NavButton
                  as={NavLink}
                  to={"workspaces/" + currentWorkspace?.name + "/settings"}
                  label="Settings"
                  icon={FiSettings}
                />
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
          <Stack spacing={{ base: "5", sm: "6" }}>
            <CommandBar />
            <WorkspacesMenu />
            <Menu>
              <MenuButton>
                <UserProfile name={user?.nickname || ""} email={user?.email || ""} />
              </MenuButton>
              <MenuList bg={"#1e1e1e"}>
                <MenuItem bg={"#1e1e1e"} fontSize={"sm"} onClick={() => { navigate("/account") }} icon={<FiUser size={"20px"} />}>Update Profile</MenuItem>
                <MenuItem bg={"#1e1e1e"} fontSize={"sm"} onClick={() => {
                  localStorage.clear()
                  logout({ returnTo: APP_URI })
                }} icon={<FiLogOut size={"20px"} />}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Stack>
        </Stack>
      </Flex>
    </Flex>
  );
};
