import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import { useRecoilState } from 'recoil';
import { currentWorkspaceState } from '../../store/workspaces';

export const LoginCallback = () => {
    const navigate = useNavigate();
    const [_,setcurrentWorkspace] = useRecoilState(currentWorkspaceState);

    useEffect(() => {
        setTimeout(async () => {
            setcurrentWorkspace(null)
            navigate("/workspaces")
        }, 2000)
    }, [])

    return (
        <Box></Box>
    )
}
