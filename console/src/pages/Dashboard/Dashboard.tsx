import { useAuth0 } from '@auth0/auth0-react'
import { Box } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

const Dashboard = () => {
  const { getAccessTokenSilently}  = useAuth0()
  const [token, setToken] = useState("")

  useEffect(() => {
    document.title = "Faasly Console | Dashboard"
  }, [])
  
  return (
    <Box w={"100%"} maxW={"100%"} overflowX={"auto"} onClick={async () => {
        setToken(await getAccessTokenSilently())
    }}>Dashboard {token}</Box>
  )
}

export default Dashboard