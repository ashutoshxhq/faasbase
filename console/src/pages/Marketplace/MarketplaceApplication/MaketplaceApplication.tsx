import { useAuth0 } from '@auth0/auth0-react';
import { Box, Skeleton, Stack, Tab, TabList, TabPanels, Tabs, Text, TabPanel } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { getApplication } from '../../../api/applications';
import { useQuery } from '@tanstack/react-query';

function MarketplaceApplication() {
  const { applicationId } = useParams();
  const [tabIndex, setTabIndex] = useState(0)
  const navigate = useNavigate();
  const location = useLocation();

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
    } else {
      navigate(`/marketplace/applications/${applicationId}/overview`)
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
              <Tab onClick={()=> navigate(`/marketplace/applications/${applicationId}/overview`)} _selected={{color: "orange.500", borderColor:"orange.500", fontWeight:"bold"}}>Overview</Tab>
              <Tab onClick={()=> navigate(`/marketplace/applications/${applicationId}/resources`)} _selected={{color: "orange.500", borderColor:"orange.500", fontWeight:"bold"}}>Resources</Tab>
              <Tab onClick={()=> navigate(`/marketplace/applications/${applicationId}/builds`)} _selected={{color: "orange.500", borderColor:"orange.500", fontWeight:"bold"}}>Builds & Versions</Tab>
            </TabList>
          </Stack>
        </Box>
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignContent={"start"}
          flexDirection={"column"}
        >
          <Outlet/>
        </Box>
      </Tabs>
    </Box>
  )
}

export default MarketplaceApplication