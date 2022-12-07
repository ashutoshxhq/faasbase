import { useAuth0 } from '@auth0/auth0-react'
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Badge, Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, FormControl, FormLabel, HStack, IconButton, Input, Select, Table, Tbody, Td, Text, Textarea, Th, Thead, Tr, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { SiKubernetes } from 'react-icons/si'
import { useRecoilState } from 'recoil'
import { createKubernetesCluster, deleteKubernetesCluster, getKubernetesClusters, updateKubernetesCluster } from '../../../api/integrations'
import { currentWorkspaceState } from '../../../store/workspaces'

const KubernetesClusters = () => {
    const { getAccessTokenSilently } = useAuth0();
    const [currentWorkspace,] = useRecoilState(currentWorkspaceState);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();
    const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();
    const queryClient = useQueryClient()
    const toast = useToast()
    const query = useQuery(['kubernetes-clusters', { getAccessTokenSilently, currentWorkspace }], getKubernetesClusters)
    const cancelRef = React.useRef<any>();
    const [selectedCluster, setSelectedCluster] = useState<any>()

    const mutation = useMutation((id: any) => deleteKubernetesCluster(id, getAccessTokenSilently), {
        onSuccess: () => {
            queryClient.invalidateQueries([`kubernetes-clusters`])
            toast({
                title: "Success",
                description: "Cluster deleted successfully",
                status: "success",
                position: "bottom-right",
                duration: 5000,
                isClosable: true,
            });
            onDeleteModalClose()
        },

        onError: () => {
            toast({
                title: "Failed",
                description: "Unable to delete Cluster",
                status: "error",
                position: "bottom-right",
                duration: 5000,
                isClosable: true,
            });
            onDeleteModalClose()
        }
    })
    return (
        <Box mb={10}>
            <CreateKubernetesCluster isOpen={isOpen} onClose={onClose} />
            <EditKubernetesCluster data={selectedCluster} isOpen={isUpdateOpen} onClose={onUpdateClose} />
            <Box
                bg={"#1e1e1e"}
                boxShadow={useColorModeValue("sm", "sm-dark")}
                borderRadius="lg"
                pb={10}
            >
                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} p={6}>
                    <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} mr={4}>
                            <SiKubernetes size={"30px"} />
                        </Box>
                        <Box>
                            <Text fontSize="xl" fontWeight="medium">
                                Clusters
                            </Text>
                            <Text color="muted" fontSize="sm">
                                Connect your kubernetes clustors to deploy applications
                            </Text>
                        </Box>
                    </Box>


                    <Button onClick={onOpen} variant='solid' bgGradient='linear(to-r, orange.500, orange.600)' _hover={{ backgroundColor: "orange.500" }} _active={{ backgroundColor: "orange.500" }}>Connect New Cluster</Button>
                </Box>
                <Table bg={"#1e1e1e"} borderColor="whiteAlpha.200" borderRadius="lg">
                    <Thead bg={"#1e1e1e"}>
                        <Tr borderRadius="lg">
                            <Th bg={"whiteAlpha.200"} borderColor="whiteAlpha.200" >CLUSTER NAME</Th>
                            <Th bg={"whiteAlpha.200"} borderColor="whiteAlpha.200" >PROVIDER</Th>
                            <Th bg={"whiteAlpha.200"} borderColor="whiteAlpha.200" >REGION</Th>
                            <Th bg={"whiteAlpha.200"} borderColor="whiteAlpha.200" >STATUS</Th>
                            <Th bg={"whiteAlpha.200"} borderColor="whiteAlpha.200" >ACTIONS</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {query.data?.data.data.map((cluster: any) => <Tr>
                            <Td borderColor="whiteAlpha.200" >
                                <Text fontWeight="medium">{cluster?.name}</Text>
                            </Td>
                            <Td borderColor="whiteAlpha.200" >
                                <Text fontWeight="medium">{cluster?.provider}</Text>
                            </Td>
                            <Td borderColor="whiteAlpha.200" >
                                <Text fontWeight="medium">{cluster?.provider_config?.region}</Text>
                            </Td>
                            <Td borderColor="whiteAlpha.200" >
                                <Badge size="sm" colorScheme={'orange'}>
                                    {cluster?.status}
                                </Badge>
                            </Td>

                            <Td borderColor="whiteAlpha.200" >
                                <HStack spacing="1">
                                    <IconButton
                                        icon={<FiTrash2 fontSize="1.25rem" />}
                                        variant="ghost"
                                        _hover={{ backgroundColor: "whiteAlpha.200" }} _active={{ backgroundColor: "whiteAlpha.200" }}
                                        aria-label="Delete cluster"
                                        onClick={() => {
                                            setSelectedCluster(cluster)
                                            onDeleteModalOpen()
                                        }}
                                    />
                                    <IconButton
                                        icon={<FiEdit2 fontSize="1.25rem" />}
                                        variant="ghost"
                                        _hover={{ backgroundColor: "whiteAlpha.200" }} _active={{ backgroundColor: "whiteAlpha.200" }}
                                        aria-label="Edit cluster"
                                        onClick={() => {
                                            setSelectedCluster(cluster)
                                            onUpdateOpen()
                                        }}
                                    />
                                </HStack>
                            </Td>
                        </Tr>)}


                    </Tbody>
                </Table>
            </Box>
            <AlertDialog
                isOpen={isDeleteModalOpen}
                leastDestructiveRef={cancelRef}
                onClose={onDeleteModalClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent bg={"#1e1e1e"}>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Cluster
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to delete this cluster ?
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onDeleteModalClose}>
                                Cancel
                            </Button>
                            <Button
                                bg={"red.500"}
                                _hover={{ backgroundColor: "red.600" }}
                                _active={{ backgroundColor: "red.600" }}
                                isLoading={mutation.isLoading}
                                loadingText={"Deleting"}
                                onClick={() => {
                                    mutation.mutate(selectedCluster?.id)
                                }}
                                ml={3}
                            >
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    )
}

export default KubernetesClusters



interface CreateKubernetesClusterProp {
    isOpen: boolean;
    onClose: () => void;
}

const CreateKubernetesCluster = (props: CreateKubernetesClusterProp) => {
    const [name, setName] = useState("");
    const [config, setConfig] = useState<any>("")
    const [provider, setProvider] = useState("AWS")
    const [accessKey, setAccessKey] = useState("")
    const [accessSecret, setAccessSecret] = useState("")
    const [region, setRegion] = useState("")

    const { getAccessTokenSilently, getIdTokenClaims } = useAuth0();
    const [currentWorkspace,] = useRecoilState(currentWorkspaceState);
    const queryClient = useQueryClient()
    const toast = useToast()
    const createKubernetesClusterMutation = useMutation((data: any) => createKubernetesCluster(data, getAccessTokenSilently), {
        onSuccess: () => {
            queryClient.invalidateQueries([`kubernetes-clusters`])
            toast({
                title: "Success",
                description: "Kubernetes Cluster connected successfully",
                status: "success",
                position: "bottom-right",
                duration: 5000,
                isClosable: true,
            });
            props.onClose()
            setName("")
            setConfig("")
            setAccessKey("")
            setAccessSecret("")
            setRegion("")
            setProvider("AWS")
        },

        onError: () => {
            toast({
                title: "Failed",
                description: "Unable to connect Kubernetes Cluster",
                status: "error",
                position: "bottom-right",
                duration: 5000,
                isClosable: true,
            });
        }
    })
    return (
        <>
            <Drawer isOpen={props.isOpen} onClose={props.onClose} size="lg" >
                <DrawerOverlay />
                <DrawerContent mx={"23px"} my={"53px"} borderRadius={"8px"} bg={"#1e1e1e"} overflowY={"scroll"}>
                    <DrawerCloseButton />
                    <DrawerHeader data-tauri-drag-region>Connect New Cluster</DrawerHeader>
                    <DrawerBody>
                        <FormControl isRequired mt={8}>
                            <FormLabel htmlFor="name">Cluster Name</FormLabel>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </FormControl>

                        <FormControl isRequired mt={8}>
                            <FormLabel htmlFor="cluster-config">Cluster Config</FormLabel>
                            <Textarea
                                id="cluster-config"
                                value={config}
                                onChange={(e) => setConfig(e.target.value)}
                            />
                        </FormControl>

                        <FormControl isRequired mt={8}>
                            <FormLabel htmlFor="aws-account">Container Registory</FormLabel>
                            <Select placeholder='Select account' border={"2px"} value={provider} onChange={(e) => {
                                setProvider(e.target.value)
                            }}>
                                <option value="AWS"> AWS- Elastic Container Registory</option>
                            </Select>
                        </FormControl>
                        {provider === "AWS" ? <>
                            <FormControl isRequired mt={8}>
                                <FormLabel htmlFor="name">AWS Access Key ID</FormLabel>
                                <Input
                                    id="aws_access_key_id"
                                    value={accessKey}
                                    onChange={(e) => setAccessKey(e.target.value)}
                                />
                            </FormControl>

                            <FormControl isRequired mt={8}>
                                <FormLabel htmlFor="name">AWS Access Secret Key</FormLabel>
                                <Input
                                    id="name"
                                    value={accessSecret}
                                    onChange={(e) => setAccessSecret(e.target.value)}
                                />
                            </FormControl>

                            <FormControl isRequired mt={8}>
                                <FormLabel htmlFor="aws-region">Region</FormLabel>
                                <Select placeholder='Select region' border={"2px"} value={region} onChange={(e) => setRegion(e.target.value)}>
                                    <option value="us-east-2"> us-east-2</option>
                                    <option value="us-east-1">us-east-1</option>
                                    <option value="us-west-1"> us-west-1</option>
                                    <option value="us-west-2"> us-west-2</option>
                                    <option value="af-south-1">af-south-1 </option>
                                    <option value="ap-east-1"> ap-east-1</option>
                                    <option value="ap-southeast-3">ap-southeast-3 </option>
                                    <option value="ap-south-1">ap-south-1 </option>
                                    <option value="ap-northeast-3"> ap-northeast-3</option>
                                    <option value="ap-northeast-2">ap-northeast-2 </option>
                                    <option value="ap-southeast-1"> ap-southeast-1</option>
                                    <option value="ap-southeast-2"> ap-southeast-2</option>
                                    <option value="ap-northeast-1">ap-northeast-1 </option>
                                    <option value="ca-central-1">ca-central-1 </option>
                                    <option value="eu-central-1">eu-central-1 </option>
                                    <option value="eu-west-3">eu-west-3 </option>
                                    <option value="eu-north-1">eu-north-1 </option>
                                    <option value="me-south-1">me-south-1 </option>
                                    <option value="me-central-1">me-central-1 </option>
                                    <option value="sa-east-1">sa-east-1 </option>
                                </Select>
                            </FormControl>
                        </> : null}



                    </DrawerBody>
                    <DrawerFooter>
                        <Button variant='solid' colorScheme={"gray"} mr={3} onClick={() => props?.onClose()}>
                            Cancel
                        </Button>
                        <Button
                            isLoading={createKubernetesClusterMutation.isLoading}
                            loadingText={"Creating"}
                            onClick={() => {
                                createKubernetesClusterMutation.mutate({
                                    name,
                                    cluster_config: config,
                                    provider,
                                    provider_config: {
                                        aws_access_key_id: accessKey,
                                        aws_secret_access_key: accessSecret,
                                        region
                                    },
                                    workspace_id: currentWorkspace?.id
                                })
                            }}
                            variant="solid"
                            bgGradient='linear(to-r, orange.500, orange.600)'
                            _hover={{ backgroundColor: "orange.500" }}
                            _active={{ backgroundColor: "orange.500" }}
                        >
                            Connect Cluster
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}



interface EditKubernetesClusterProp {
    data: any;
    isOpen: boolean;
    onClose: () => void;
}

const EditKubernetesCluster = (props: EditKubernetesClusterProp) => {
    const [name, setName] = useState("");
    const [config, setConfig] = useState<any>("")
    const [provider, setProvider] = useState("AWS")
    const [accessKey, setAccessKey] = useState("")
    const [accessSecret, setAccessSecret] = useState("")
    const [region, setRegion] = useState("")

    const { getAccessTokenSilently } = useAuth0();
    const [currentWorkspace,] = useRecoilState(currentWorkspaceState);
    const queryClient = useQueryClient()
    const toast = useToast()
    const updateKubernetesClusterMutation = useMutation(({ id, data }: { id: string, data: any }) => updateKubernetesCluster(id, data, getAccessTokenSilently), {
        onSuccess: () => {
            queryClient.invalidateQueries([`kubernetes-clusters`])
            toast({
                title: "Success",
                description: "KubernetesCluster created successfully",
                status: "success",
                position: "bottom-right",
                duration: 5000,
                isClosable: true,
            });
            props.onClose()
        },

        onError: () => {
            toast({
                title: "Failed",
                description: "Unable to create KubernetesCluster",
                status: "error",
                position: "bottom-right",
                duration: 5000,
                isClosable: true,
            });
        }
    })

    useEffect(() => {
        setName(props.data?.name)
        setConfig(props.data?.cluster_config)
        setAccessKey(props.data?.provider_config?.aws_access_key_id)
        setAccessSecret(props.data?.provider_config?.aws_secret_access_key)
        setRegion(props.data?.provider_config?.region)
        setProvider(props.data?.provider)
    }, [props.data])


    return (
        <>
            <Drawer isOpen={props.isOpen} onClose={props.onClose} size="lg" >
                <DrawerOverlay />
                <DrawerContent mx={"23px"} my={"53px"} borderRadius={"8px"} bg={"#1e1e1e"} overflowY={"scroll"}>
                    <DrawerCloseButton />
                    <DrawerHeader data-tauri-drag-region>Update Account</DrawerHeader>
                    <DrawerBody>
                        <FormControl isRequired mt={8}>
                            <FormLabel htmlFor="name">Cluster Name</FormLabel>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </FormControl>

                        <FormControl isRequired mt={8}>
                            <FormLabel htmlFor="cluster-config">Cluster Config</FormLabel>
                            <Textarea
                                id="cluster-config"
                                value={config}
                                onChange={(e) => setConfig(e.target.value)}
                            />
                        </FormControl>

                        <FormControl isRequired mt={8}>
                            <FormLabel htmlFor="aws-account">Container Registory</FormLabel>
                            <Select placeholder='Select account' border={"2px"} value={provider} onChange={(e) => {
                                setProvider(e.target.value)
                            }}>
                                <option value="AWS"> AWS- Elastic Container Registory</option>
                            </Select>
                        </FormControl>
                        {provider === "AWS" ? <>
                            <FormControl isRequired mt={8}>
                                <FormLabel htmlFor="name">AWS Access Key ID</FormLabel>
                                <Input
                                    id="aws_access_key_id"
                                    value={accessKey}
                                    onChange={(e) => setAccessKey(e.target.value)}
                                />
                            </FormControl>

                            <FormControl isRequired mt={8}>
                                <FormLabel htmlFor="name">AWS Access Secret Key</FormLabel>
                                <Input
                                    id="name"
                                    value={accessSecret}
                                    onChange={(e) => setAccessSecret(e.target.value)}
                                />
                            </FormControl>

                            <FormControl isRequired mt={8}>
                                <FormLabel htmlFor="aws-region">Region</FormLabel>
                                <Select placeholder='Select region' border={"2px"} value={region} onChange={(e) => setRegion(e.target.value)}>
                                    <option value="us-east-2"> us-east-2</option>
                                    <option value="us-east-1">us-east-1</option>
                                    <option value="us-west-1"> us-west-1</option>
                                    <option value="us-west-2"> us-west-2</option>
                                    <option value="af-south-1">af-south-1 </option>
                                    <option value="ap-east-1"> ap-east-1</option>
                                    <option value="ap-southeast-3">ap-southeast-3 </option>
                                    <option value="ap-south-1">ap-south-1 </option>
                                    <option value="ap-northeast-3"> ap-northeast-3</option>
                                    <option value="ap-northeast-2">ap-northeast-2 </option>
                                    <option value="ap-southeast-1"> ap-southeast-1</option>
                                    <option value="ap-southeast-2"> ap-southeast-2</option>
                                    <option value="ap-northeast-1">ap-northeast-1 </option>
                                    <option value="ca-central-1">ca-central-1 </option>
                                    <option value="eu-central-1">eu-central-1 </option>
                                    <option value="eu-west-3">eu-west-3 </option>
                                    <option value="eu-north-1">eu-north-1 </option>
                                    <option value="me-south-1">me-south-1 </option>
                                    <option value="me-central-1">me-central-1 </option>
                                    <option value="sa-east-1">sa-east-1 </option>
                                </Select>
                            </FormControl>
                        </> : null}


                    </DrawerBody>
                    <DrawerFooter>
                        <Button variant='solid' colorScheme={"gray"} mr={3} onClick={() => props?.onClose()}>
                            Cancel
                        </Button>
                        <Button
                            isLoading={updateKubernetesClusterMutation.isLoading}
                            loadingText={"Updating"}
                            onClick={() => {
                                updateKubernetesClusterMutation.mutate({
                                    id: props.data.id,
                                    data: {
                                        name,
                                        cluster_config: config,
                                        provider,
                                        provider_config: {
                                            aws_access_key_id: accessKey,
                                            aws_secret_access_key: accessSecret,
                                            region
                                        },
                                        workspace_id: currentWorkspace?.id
                                    }
                                })
                            }}
                            variant="solid"
                            bgGradient='linear(to-r, orange.500, orange.600)'
                            _hover={{ backgroundColor: "orange.500" }}
                            _active={{ backgroundColor: "orange.500" }}
                        >
                            Update Account
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}