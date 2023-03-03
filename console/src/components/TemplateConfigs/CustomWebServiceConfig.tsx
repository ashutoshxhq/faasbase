import { useAuth0 } from '@auth0/auth0-react'
import { Box, Button, FormControl, FormLabel, Input, Stack, Switch, Text, useColorModeValue } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useRecoilState } from 'recoil'
import { getKubernetesClusters } from '../../api/integrations'
import { currentWorkspaceState } from '../../store/workspaces'
import { CustomSelect, Option } from '../CustomSelect/CustomSelect'

interface CustomWebServiceConfigProps {
    setConfig: (value: any) => void
    config: any,
}

const CustomWebServiceConfig = (props: CustomWebServiceConfigProps) => {
    const { getAccessTokenSilently } = useAuth0();
    const [currentWorkspace,] = useRecoilState(currentWorkspaceState);
    const query = useQuery(['kubernetes-clusters', { getAccessTokenSilently, currentWorkspace }], getKubernetesClusters)

    const { config, setConfig } = props

    return (
        <Box
        >
            <Box display="flex" justifyContent={"start"} alignItems={"start"} flexDir={"column"} mt={8} gap="2">
                <Box w={"40%"}>
                    <FormControl mb={4} mt={4}>
                        <FormLabel htmlFor={"jwt"}>Deploy To Cluster</FormLabel>
                        <CustomSelect value={config?.deployment_target} onChange={(val) => {
                            setConfig({
                                ...config,
                                deployment_target: val
                            })
                        }} >
                            {query.data?.data.data.map((cluster: any) => <Option key={cluster?.id} value={cluster?.id}>{cluster?.name}</Option>)}
                        </CustomSelect>
                    </FormControl>
                </Box>

                <Box display="flex" justifyContent={"start"} alignItems={"start"} flexDir={"column"} w={"100%"}>
                    <FormControl mb={4} mt={4} maxW={"200px"} isRequired>
                        <FormLabel htmlFor={"jwt"}>Enable JWT Auth ?</FormLabel>
                        <Switch my="4px" id="jwt" size='lg' isChecked={config?.jwt_auth_enabled || false} onChange={(e) => {
                            setConfig({
                                ...config,
                                jwt_auth_enabled: !(config?.jwt_auth_enabled || false)
                            })
                        }} sx={{ 'span.chakra-switch__track[data-checked]': { backgroundColor: 'orange.500' } }} colorScheme='orange' />
                    </FormControl>
                    <Box display="flex" justifyContent={"start"} alignItems={"start"} flexDir={"row"} gap="6" flex="1" w={"100%"}>
                        {config?.jwt_auth_enabled ? <FormControl mb={4} mt={4} maxW={"200px"} isRequired>
                            <FormLabel htmlFor={"jwt"}>JWT Algorithm</FormLabel>
                            <CustomSelect value={config?.jwt_algorithm} isRequired onChange={(val) => {
                                setConfig({
                                    ...config,
                                    jwt_algorithm: val
                                })
                            }}>
                                <Option value="HS256" />
                                <Option value="RS256" />
                            </CustomSelect>
                        </FormControl> : null}
                        {config?.jwt_algorithm === "HS256" && config?.jwt_auth_enabled ? <FormControl mb={4} mt={4} maxW={"50%"} isRequired>
                            <FormLabel htmlFor={"jwt"}>JWT Secret</FormLabel>
                            <Input type="secret" variant={"outline"} isRequired value={config?.jwt_secret} onChange={(e) => {
                                setConfig({
                                    ...config,
                                    jwt_secret: e.target.value
                                })
                            }} />
                        </FormControl> : null}

                        {config?.jwt_algorithm === "RS256" && config?.jwt_auth_enabled ? <FormControl mb={4} mt={4} isRequired>
                            <FormLabel htmlFor={"jwt"}>JSON Web Key Set URI</FormLabel>
                            <Input type="secret" variant={"outline"} isRequired value={config?.jwks_uri} onChange={(e) => {
                                setConfig({
                                    ...config,
                                    jwks_uri: e.target.value
                                })
                            }} />
                        </FormControl> : null}
                    </Box>
                </Box>


            </Box>
        </Box>
    )
}

export default CustomWebServiceConfig