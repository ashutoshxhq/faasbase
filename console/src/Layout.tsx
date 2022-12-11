import { Box, Text } from '@chakra-ui/react'
import { FiChevronLeft } from 'react-icons/fi'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { SideBar } from './components/Sidebar/Sidebar'
import { useAuth0 } from '@auth0/auth0-react'
import SplashScreen from './SplashScreen'
import { useQuery } from '@tanstack/react-query'
import { getUser } from './api/users'
import { getFunctions } from './api/functions'
import { useRecoilState } from 'recoil'
import { currentWorkspaceState } from './store/workspaces'
import { getKubernetesClusters } from './api/integrations'
import { getApplications } from './api/applications'
import { getCurrentWorkspace, getCurrentWorkspaceMembers, getWorkspaces } from './api/workspaces'

const Layout = () => {

    const { isAuthenticated, isLoading } = useAuth0()
    const { getAccessTokenSilently, getIdTokenClaims } = useAuth0();
    const [currentWorkspace,] = useRecoilState(currentWorkspaceState);

    const workspacesQuery = useQuery(['workspaces', { getAccessTokenSilently }], getWorkspaces)
    const currentUserQuery = useQuery([`current-user`, { getAccessTokenSilently, getIdTokenClaims }], getUser)
    const currentWorkspaceQuery = useQuery([`current-workspace`, { getAccessTokenSilently, currentWorkspace }], getCurrentWorkspace)
    const workspaceMembersQuery = useQuery([`workspace-members`, { getAccessTokenSilently, currentWorkspace }], getCurrentWorkspaceMembers)
    const functionsQuery = useQuery(['functions', { getAccessTokenSilently, currentWorkspace }], getFunctions)
    const kubernetesClustersQuery = useQuery(['kubernetes-clusters', { getAccessTokenSilently, currentWorkspace }], getKubernetesClusters)
    const applicationsQuery = useQuery(['applications', { getAccessTokenSilently, currentWorkspace }], getApplications)

    return (
        !isLoading ?
            isAuthenticated ?
                currentWorkspace ?
                    (currentUserQuery.isFetched && currentWorkspaceQuery.isFetched && workspaceMembersQuery.isFetched && functionsQuery.isFetched && kubernetesClustersQuery.isFetched && applicationsQuery.isFetched) ?
                        <LayoutComponent />
                        : <SplashScreen />
                    : (workspacesQuery.isFetched) ?
                        <LayoutComponent />
                        : <SplashScreen />
                : <Navigate to={"/auth/login"} /> : <SplashScreen />
    )
}

export const LayoutComponent = () => {
    const navigate = useNavigate()

    return (
        <Box className="console" height={"100vh"} display={"flex"} bg="#121212" overflow={"hidden"}>
            <SideBar />

            <Box width={"calc( 100% - 80px)"}>
                <div data-tauri-drag-region className="titlebar">
                    <Box display={"flex"} px={2} alignItems={"center"}>
                        <Box color={"#767676"} _hover={{ cursor: "pointer", color: "orange.500" }} mr={2} onClick={() => { navigate(-1) }} display={"flex"} alignItems={"center"} >
                            <FiChevronLeft size={20} /> <Text fontSize={"md"} fontWeight={"semibold"}>Back</Text>
                        </Box>
                    </Box>
                </div>
                <Box maxW={"1500px"} px={8} margin={"0 auto"}>
                    <Outlet />

                </Box>
            </Box>
        </Box>
    )
}


export default Layout