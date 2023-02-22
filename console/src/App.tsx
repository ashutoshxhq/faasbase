import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import Layout from './Layout'
import Dashboard from './pages/Dashboard/Dashboard'
import Functions from './pages/Functions/Functions'
import Function from './pages/Functions/Function/Function'
import Marketplace from './pages/Marketplace/Marketplace'
import WorkspaceSettings from './pages/Settings/WorkspaceSettings'
import NoInternet from './pages/Errors/NoInternet'
import { Auth0Provider } from '@auth0/auth0-react'
import Login from './pages/Login/Login'
import { LoginCallback } from './pages/LoginCallback/LoginCallback'
import Offline from './Offline'
import { AUTH0_AUDIENCE, AUTH0_CLIENT_ID, AUTH0_DOMAIN, AUTH0_REDIRECT_URI, AUTH0_SCOPE } from './config/constants'
import Applications from './pages/Applications/Applications'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Application from './pages/Applications/Application/Application'
import { useRecoilState } from 'recoil'
import { currentWorkspaceState } from './store/workspaces'
import Workspaces from './pages/Workspaces/Workspaces'
import AccountSettings from './pages/Settings/AccountSettings'
import Database from './pages/Databases/Database/Database'
import MarketplaceFunction from './pages/Marketplace/MarketplaceFunction/MarketplaceFunction'
import MarketplaceApplication from './pages/Marketplace/MarketplaceApplication/MaketplaceApplication'
import DatabaseTable from './pages/Databases/Database/DatabaseTable/DatabaseTable'
import Databases from './pages/Databases/Databases'
import FaasbaseExperts from './pages/Experts/Experts'
import DatabaseDetails from './pages/Databases/Database/DatabaseDetails'

const queryClient = new QueryClient()

function App() {
  
  const [isOnline, setIsOnline] = useState(true)
  
  useEffect(() => {
    if (navigator.onLine) {
      setIsOnline(true)
    } else {
      setIsOnline(false)
    }
    window.onoffline = (_event) => {
      console.log("Connection Lost")
      setIsOnline(false)
    };
    window.ononline = (_event) => {
      setIsOnline(true)
      console.log("Back Online")
    };
  }, [])

  return (
    isOnline ? (
      <QueryClientProvider client={queryClient}>
        <Auth0Provider
          domain={AUTH0_DOMAIN}
          clientId={AUTH0_CLIENT_ID}
          redirectUri={AUTH0_REDIRECT_URI}
          useRefreshTokens
          cacheLocation={"localstorage"}
          scope={AUTH0_SCOPE}
          audience={AUTH0_AUDIENCE}
        >
          <BrowserRouter>
            <Routes>
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/callback" element={<LoginCallback />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<FaasbaseRoot />} />
                <Route path="workspaces" element={<Workspaces />} />
                <Route path="workspaces/:workspaceName/dashboard" element={<Dashboard />} />
                <Route path="workspaces/:workspaceName/applications" element={<Applications />} />
                <Route path="workspaces/:workspaceName/applications/:applicationId" element={<Application />} />
                <Route path="workspaces/:workspaceName/functions" element={<Functions />} />
                <Route path="workspaces/:workspaceName/functions/:functionId" element={<Function />} />
                <Route path="workspaces/:workspaceName/databases" element={<Databases />} />
                <Route path="workspaces/:workspaceName/databases/:databaseId" element={<Database />}>
                  <Route index element={<DatabaseDetails />}/>
                  <Route path="tables/:tableId" element={<DatabaseTable />}/>
                </Route>
                <Route path="experts" element={<FaasbaseExperts />} />
                <Route path="workspaces/:workspaceName/settings" element={<WorkspaceSettings />} />
                <Route path="marketplace" element={<Marketplace />} />
                <Route path="marketplace/functions/:functionId" element={<MarketplaceFunction />} />
                <Route path="marketplace/applications/:applicationId" element={<MarketplaceApplication />} />
                <Route path="account" element={<AccountSettings />} />
                <Route path="no-internet" element={<NoInternet />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </Auth0Provider>
      </QueryClientProvider>
    ) :
      <Offline />
  )
}

export default App


export const FaasbaseRoot = () => {
  const navigate = useNavigate();
  const [currentWorkspace,] = useRecoilState(currentWorkspaceState);

  useEffect(() => {
    if(currentWorkspace){
      navigate("workspaces/" + currentWorkspace?.name + "/applications")
    } else{
      navigate("/workspaces")
    }
  }, [currentWorkspace])

  return (
    <div></div>
  )
}
