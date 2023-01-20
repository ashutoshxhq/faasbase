import { useAuth0 } from '@auth0/auth0-react';
import { Box, Button, Stack, Text } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'
import { getFunction } from '../../../../api/functions';

const FunctionOverview = () => {
  const { functionId } = useParams();
  const {getAccessTokenSilently} = useAuth0();

  const query = useQuery([`functions-${functionId}`,{ getAccessTokenSilently, functionId }], getFunction)
  return (
    <Box
      display={"flex"}
      justifyContent={"start"}
      alignContent={"start"}
      flexWrap={"wrap"}
      gap={"30px"}
    >
      <ReactMarkdown children={query?.data?.data?.data?.readme} />
    </Box>
  )
}

export default FunctionOverview