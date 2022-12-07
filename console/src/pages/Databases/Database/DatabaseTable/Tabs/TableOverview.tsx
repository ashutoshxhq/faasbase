import { useAuth0 } from '@auth0/auth0-react';
import { Box, Button, Stack, Text } from '@chakra-ui/react'
import { useParams } from 'react-router-dom';

const FunctionOverview = () => {
  const { functionId } = useParams();
  const {getAccessTokenSilently} = useAuth0();

  return (
    <Box
      display={"flex"}
      justifyContent={"start"}
      alignContent={"start"}
      flexWrap={"wrap"}
      gap={"30px"}
    >
      <Text fontSize="lg" fontWeight="medium">
        Connected Applications
      </Text>
      {[].map((application: any, index: number) => (
        <Box 
          key = {index}
          as="section" 
          borderRadius={8}
          bg={"#1e1e1e"}
          boxShadow={"2xl"}
          border={"solid 0px #424242fd"}
          px={8}
          py={6}
          width={"calc(100%)"}
          _hover={{ background: "#1e1e1e" }}
        >
        <Stack
          // px={8}
          direction={{ base: "column", sm: "row" }}
          justify="space-between"
          alignItems={"center"}
        >
          <Box>
            <Text fontSize="lg" fontWeight="medium">
              {application.name}
            </Text>
            <Text color="muted" fontSize="sm">
              {application.description}
            </Text>
          </Box>
          <Stack direction="row">
            <Button onClick={()=>{}} variant="solid" bgGradient='linear(to-r, orange.500, orange.600)' _hover={{ backgroundColor: "orange.500" }} _active={{ backgroundColor: "orange.500" }}>Open App</Button>
          </Stack>
        </Stack>
        </Box>))
      }
    </Box>
  )
}

export default FunctionOverview