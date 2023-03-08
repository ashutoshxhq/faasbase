import { useAuth0 } from '@auth0/auth0-react';
import { Box, Skeleton, Stack, Tab, TabList, TabPanels, Tabs, Text, TabPanel } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { getApplication } from '../../../api/applications';
import ApplicationBuildsAndDeployments from './Tabs/ApplicationBuildsAndDeployments';
import ApplicationOverview from './Tabs/ApplicationOverview';
import ApplicationResources from './Tabs/ApplicationResources';
import ApplicationSettings from './Tabs/ApplicationSettings';
import { useQuery } from '@tanstack/react-query';
import { ApplicationCollaborator } from './Tabs/ApplicationCollaborator';
import ApplicationVariables from './Tabs/ApplicationVariables';

function Application() {
  const { applicationId, workspaceName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [tabIndex, setTabIndex] = useState(0)
  const { getAccessTokenSilently } = useAuth0();
  const query = useQuery([`application-${applicationId}`, { getAccessTokenSilently, applicationId }], getApplication)

  const handleTabsChange = (index: any) => {
    setTabIndex(index)
  }

  useEffect(() => {
    document.title = "Faasbase Console | Applications | " + query?.data?.data?.data?.name

    if (location.pathname.includes("overview")) {
      setTabIndex(0)
    } else if (location.pathname.includes("resources")) {
      setTabIndex(1)
    } else if (location.pathname.includes("builds")) {
      setTabIndex(2)
    } else if (location.pathname.includes("collaborators")) {
      setTabIndex(3)
    } else if (location.pathname.includes("variables")) {
      setTabIndex(4)
    } else if (location.pathname.includes("settings")) {
      setTabIndex(5)
    } else {
      navigate(`/workspaces/${workspaceName}/applications/${applicationId}/overview`)
    }

  }, [query?.data, location.pathname])


  return (
    <Box height={"calc(100vh - 40px)"} overflowY={"scroll"}>
      <Tabs variant="line" index={tabIndex} onChange={handleTabsChange}>
        <Box mt={4} py={4} px={4} as="section" data-tauri-drag-region>
          <Stack data-tauri-drag-region spacing="8">
            <Stack
              data-tauri-drag-region
              spacing="4"
              direction={{ base: "column", sm: "row" }}
              justify="space-between"
            >
              <Box display={"flex"} gap={4} justifyContent="start" alignItems={"center"} w={"100%"} data-tauri-drag-region>
                {query?.isFetched ? <Box>
                  <Text fontSize="2xl" fontWeight="medium">
                    {query?.data?.data?.data?.name}
                  </Text>
                  <Text color="muted" fontSize="sm">
                    {query?.data?.data?.data?.description}
                  </Text>
                </Box> :
                  <Stack width={"50%"}>
                    <Skeleton startColor='#1e1e1e' endColor='#424242' height='30px' width={"100%"} />
                    <Skeleton startColor='#1e1e1e' endColor='#424242' height='20px' width={"100%"} />
                  </Stack>}
              </Box>
            </Stack>
            <TabList color={"muted"} data-tauri-drag-region>
              <Tab onClick={() => navigate(`/workspaces/${workspaceName}/applications/${applicationId}/overview`)} _selected={{ color: "orange.500", borderColor: "orange.500", fontWeight: "bold" }}>Overview</Tab>
              <Tab onClick={() => navigate(`/workspaces/${workspaceName}/applications/${applicationId}/resources`)} _selected={{ color: "orange.500", borderColor: "orange.500", fontWeight: "bold" }}>Resources</Tab>
              <Tab onClick={() => navigate(`/workspaces/${workspaceName}/applications/${applicationId}/builds`)} _selected={{ color: "orange.500", borderColor: "orange.500", fontWeight: "bold" }}>Builds & Deployment</Tab>
              <Tab onClick={() => navigate(`/workspaces/${workspaceName}/applications/${applicationId}/collaborators`)} _selected={{ color: "orange.500", borderColor: "orange.500", fontWeight: "bold" }}>Collaborators</Tab>
              <Tab onClick={() => navigate(`/workspaces/${workspaceName}/applications/${applicationId}/variables`)} _selected={{ color: "orange.500", borderColor: "orange.500", fontWeight: "bold" }}>Variables</Tab>
              <Tab onClick={() => navigate(`/workspaces/${workspaceName}/applications/${applicationId}/settings`)} _selected={{ color: "orange.500", borderColor: "orange.500", fontWeight: "bold" }}>Settings</Tab>
            </TabList>
          </Stack>
        </Box>
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignContent={"start"}
          flexDirection={"column"}
        >
          <Outlet />
        </Box>
      </Tabs>
    </Box>
  )
}

export default Application