import { useAuth0 } from '@auth0/auth0-react';
import { Box, Skeleton, Stack, Tab, TabList, TabPanels, Tabs, Text, TabPanel } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getApplication } from '../../../api/applications';
import ApplicationBuildsAndDeployments from './Tabs/ApplicationBuildsAndDeployments';
import ApplicationOverview from './Tabs/ApplicationOverview';
import ApplicationResources from './Tabs/ApplicationResources';
import ApplicationSettings from './Tabs/ApplicationSettings';
import { useQuery } from '@tanstack/react-query';
import { ApplicationCollaborator } from './Tabs/ApplicationCollaborator';

function Application() {
  const { applicationId } = useParams();
  const [tabIndex, setTabIndex] = useState(0)
  const { getAccessTokenSilently } = useAuth0();
  const query = useQuery([`application-${applicationId}`, { getAccessTokenSilently, applicationId }], getApplication)

  const handleTabsChange = (index: any) => {
    setTabIndex(index)
  }

  useEffect(() => {
    document.title = "Faasly Console | Applications | " + query?.data?.data?.data?.name
  }, [query?.data])


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
            <TabList  color={"muted"} data-tauri-drag-region>
              <Tab _selected={{color: "orange.500", borderColor:"orange.500", fontWeight:"bold"}}>Overview</Tab>
              <Tab _selected={{color: "orange.500", borderColor:"orange.500", fontWeight:"bold"}}>Resources</Tab>
              <Tab _selected={{color: "orange.500", borderColor:"orange.500", fontWeight:"bold"}}>Deployments</Tab>
              <Tab _selected={{color: "orange.500", borderColor:"orange.500", fontWeight:"bold"}}>Collaborators</Tab>
              <Tab _selected={{color: "orange.500", borderColor:"orange.500", fontWeight:"bold"}}>Settings</Tab>
            </TabList>
          </Stack>
        </Box>
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignContent={"start"}
          flexDirection={"column"}
        >
          <TabPanels >
            <TabPanel>
              <ApplicationOverview />
            </TabPanel>
            <TabPanel>
              <ApplicationResources />
            </TabPanel>
            <TabPanel>
              <ApplicationBuildsAndDeployments />
            </TabPanel>
            <TabPanel>
              <ApplicationCollaborator />
            </TabPanel>
            <TabPanel>
              <ApplicationSettings />
            </TabPanel>
          </TabPanels>
        </Box>
      </Tabs>
    </Box>
  )
}

export default Application