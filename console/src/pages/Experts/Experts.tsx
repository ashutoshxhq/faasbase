import { useAuth0 } from '@auth0/auth0-react'
import { Box } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

const FaasbaseExperts = () => {
  const { getAccessTokenSilently}  = useAuth0()
  const [token, setToken] = useState("")

  useEffect(() => {
    document.title = "Faasbase Console | Experts"
  }, [])
  
  return (
    <Box w={"100%"} maxW={"100%"} overflowX={"auto"} onClick={async () => {
        setToken(await getAccessTokenSilently())
    }}>FaasbaseExperts {token}</Box>
  )
}

export default FaasbaseExperts