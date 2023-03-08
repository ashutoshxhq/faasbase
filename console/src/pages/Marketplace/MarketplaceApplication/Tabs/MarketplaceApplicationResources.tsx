import { useAuth0 } from '@auth0/auth0-react';
import { Box, Container, Stack, Tag, Text} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query';
import { FiCommand } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { getApplicationResources} from '../../../../api/applications';

function MarketplaceApplicationResources() {

  const { applicationId } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const query = useQuery([`applicationResources`, { getAccessTokenSilently, applicationId }], getApplicationResources)
  
  return (
    <Box>

      <Container
        display={"flex"}
        justifyContent={"center"}
        alignContent={"start"}
        flexWrap={"wrap"}
        px={0}
        maxW={"full"}
        gap={"30px"}
      >
       

       {query.data?.data.data?.map((resource: any, index: number) => (
          <Box
            key={index}
            as="section"
            borderRadius={8}
            bg={"#1e1e1e"}
            boxShadow={"2xl"}
            border={"solid 0px #424242fd"}
            px={4}
            py={4}
            width={"calc(100%)"}
            _hover={{ background: "#1e1e1e" }}
          >
            <Stack
              // px={8}
              direction={{ base: "column", sm: "row" }}
              justify="space-between"
              alignItems={"center"}
            >
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={'center'}
                spacing={'6'}
              >
                <Box bg={"whiteAlpha.200"} p={2} borderRadius={6}>
                  <FiCommand size={24} />
                </Box>
                <Box display={"flex"} flexDirection='column' justifyContent={"center"}>
                  <Text fontSize="md" fontWeight="medium">
                    {resource?.config?.method} : {resource?.config?.endpoint}
                  </Text>
                </Box>

              </Stack>
              <Stack direction="row" spacing={4}>
                <Tag>fn: {resource?.resource_name}</Tag>
                <Tag>
                  {resource?.resource_type === "HTTP_ENDPOINT" ? "HTTP Endpoint" : null}
                </Tag>
                {resource?.config?.version ? <Tag>v{resource?.config?.version}</Tag> : null}

                
              </Stack>
            </Stack>
          </Box>))
        }
      </Container>
    </Box>
  )
}

export default MarketplaceApplicationResources


