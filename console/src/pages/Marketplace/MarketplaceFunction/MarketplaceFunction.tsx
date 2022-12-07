import { useAuth0 } from '@auth0/auth0-react'
import { Box, Icon, Image, Skeleton, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom'
import { getFunction } from '../../../api/functions'
import MarketplaceFunctionOverview from './Tabs/MarketplaceFunctionOverview';
import MarketplaceFunctionBuilds from './Tabs/MarketplaceFunctionBuilds';

const MarketplaceFunction = () => {
    const { functionId } = useParams();
    const [tabIndex, setTabIndex] = useState(0)
    const { getAccessTokenSilently } = useAuth0();

    const query = useQuery([`function-${functionId}`, { getAccessTokenSilently, functionId }], getFunction)

    const handleTabsChange = (index: any) => {
        setTabIndex(index)
    }

    useEffect(() => {
        document.title = "Faasly Console | Functions | " + query?.data?.data?.data?.name
    }, [query?.data])

    return (
        <Box height={"calc(100vh - 40px)"} overflowY={"scroll"}>
            <Tabs variant="line" index={tabIndex} onChange={handleTabsChange}>

                <Box as="section" mt={4} py={4} px={4} data-tauri-drag-region>
                    <Stack data-tauri-drag-region spacing="8">
                        <Stack
                            data-tauri-drag-region
                            spacing="4"
                            direction={{ base: "column", sm: "row" }}
                            justify="space-between"
                        >
                            <Box display={"flex"} gap={4} justifyContent="start" alignItems={"center"} w={"100%"} data-tauri-drag-region>
                                {query.isFetched ? <Box>
                                    <Text fontSize="2xl" fontWeight="medium">
                                        {query?.data?.data?.data?.name}
                                    </Text>
                                    <Text color="muted" fontSize="sm">
                                        {query?.data?.data?.data?.description}
                                    </Text>
                                </Box> : <Stack width={"50%"}>
                                    <Skeleton startColor='#1e1e1e' endColor='#424242' height='30px' width={"100%"} />
                                    <Skeleton startColor='#1e1e1e' endColor='#424242' height='20px' width={"100%"} />
                                </Stack>}
                            </Box>


                        </Stack>
                        <TabList color={"muted"} data-tauri-drag-region>
                            <Tab _selected={{color: "orange.500", borderColor:"orange.500", fontWeight:"bold"}}>Overview</Tab>
                            <Tab _selected={{color: "orange.500", borderColor:"orange.500", fontWeight:"bold"}}>Builds & Versions</Tab>
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
                            <MarketplaceFunctionOverview />
                        </TabPanel>
                        <TabPanel>
                            <MarketplaceFunctionBuilds />
                        </TabPanel>
                    </TabPanels>
                </Box>
            </Tabs>

        </Box>
    )
}

export default MarketplaceFunction