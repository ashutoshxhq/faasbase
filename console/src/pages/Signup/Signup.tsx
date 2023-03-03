import { useAuth0 } from '@auth0/auth0-react'
import React, { useEffect } from 'react'

const Signup = () => {
    const { loginWithRedirect } = useAuth0()
    useEffect(() => {
        loginWithRedirect({
            login_hint: "signup"
        })
    }, [])
    
  return (
    <div></div>
  )
}

export default Signup