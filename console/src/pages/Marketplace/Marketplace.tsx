import React, { useEffect } from 'react'
import { Box, Input, InputGroup, InputLeftElement, Stack, Tab, TabList, Tabs, Text } from '@chakra-ui/react'
import { FiSearch, FiShoppingBag } from 'react-icons/fi'
import MarketplaceFunctions from './MarketplaceFunctions'
import MarketplaceApplications from './MarketplaceApplications'

const Marketplace = () => {
  const [tabIndex, setTabIndex] = React.useState(0)
  const [searchQuery, setSearchQuery] = React.useState("");
  const handleTabsChange = (index: any) => {
    setTabIndex(index)
  }

  useEffect(() => {
    document.title = "Faasly Console | Marketplace"
  }, [])
  return (
    <>
      <Box mt={4} py={4} px={4}>
        <Stack spacing="5">
          <Stack
            spacing="4"
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
          >
            <Box display="flex" gap={4} justifyContent={"center"} alignItems={"center"}>
              <FiShoppingBag size={"40px"} />
              <Box>
                <Text fontSize="2xl" fontWeight="medium">
                  Marketplace
                </Text>
                <Text color="muted" fontSize="sm">
                  Subscribe to functions from community, or publish your own.
                </Text>
              </Box>
            </Box>
            <Box display="flex" gap={4} justifyContent={"center"} alignItems={"center"}>
              <InputGroup>
                <InputLeftElement
                  children={<FiSearch />}
                />
                <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type='text' placeholder='Search...' />
              </InputGroup>
            </Box>
          </Stack>
          <Tabs variant="line" index={tabIndex} onChange={handleTabsChange}>
            <TabList  color={"muted"}>
              <Tab _selected={{color: "orange.500", borderColor:"orange.500", fontWeight:"bold"}} onClick={() => { }}>Functions</Tab>
              <Tab _selected={{color: "orange.500", borderColor:"orange.500", fontWeight:"bold"}} onClick={() => { }}>Applications</Tab>
            </TabList>
          </Tabs>
        </Stack>
      </Box>
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignContent={"start"}
        flexDirection={"column"}
        p={4}
      >
        {tabIndex === 0 ? <MarketplaceFunctions searchQuery = {searchQuery} /> : null}
        {tabIndex === 1 ? <MarketplaceApplications searchQuery = {searchQuery}/> : null}
      </Box>
    </>
  )
}

export default Marketplace