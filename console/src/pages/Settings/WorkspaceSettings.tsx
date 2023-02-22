import {
  Box,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { FiSettings } from "react-icons/fi";
import { useRecoilState } from "recoil";
import { currentWorkspaceState } from "../../store/workspaces";
import GeneralSettings from "./Tabs/GeneralSettings";
import KubernetesClusters from "./Tabs/KubernetesClusters";
import TeamMembers from "./Tabs/TeamMembers";

const WorkspaceSettings = () => {
  const [tabIndex, setTabIndex] = React.useState(0)
  const [currentWorkspace,] = useRecoilState(currentWorkspaceState);
  const handleTabsChange = (index: any) => {
    setTabIndex(index)
  }

  useEffect(() => {
    document.title = "Faasbase Console | Workspace Settings"
  }, [])

  return (
    <>
      <Tabs variant="line" index={tabIndex} onChange={handleTabsChange}>
        <Box mt={4} py={4} px={4}>
          <Stack spacing="5">
            <Stack
              spacing="4"
              direction={{ base: "column", sm: "row" }}
              justify="space-between"
            >
              <Box display="flex" gap={4} justifyContent={"center"} alignItems={"center"}>
                <FiSettings size={"40px"} />
                <Box>
                  <Text fontSize="2xl" fontWeight="medium">
                    Preferences
                  </Text>
                  <Text color="muted" fontSize="sm">
                    Manage all your workspace settings here
                  </Text>
                </Box>
              </Box>
            </Stack>
            <TabList  color={"muted"}>
              {currentWorkspace !== null ? <Tab _selected={{color: "orange.500", borderColor:"orange.500", fontWeight:"bold"}}  onClick={() => { }}>General</Tab> : null}
              <Tab _selected={{color: "orange.500", borderColor:"orange.500", fontWeight:"bold"}} onClick={() => { }}>Members</Tab>
              <Tab _selected={{color: "orange.500", borderColor:"orange.500", fontWeight:"bold"}} onClick={() => { }}>Clusters</Tab>
            </TabList>
          </Stack>
        </Box>
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignContent={"start"}
          flexDirection={"column"}
        >
          <TabPanels>
            <TabPanel><GeneralSettings /></TabPanel>
            <TabPanel><TeamMembers /></TabPanel>
            <TabPanel><KubernetesClusters /></TabPanel>
          </TabPanels>

        </Box>
      </Tabs>
    </>
  );
};

export default WorkspaceSettings;
