import { faasbaseApi } from ".";


export const getKubernetesClusters = async ({ queryKey }: any) => {
    const [_key, { getAccessTokenSilently, currentWorkspace }] = queryKey
    if (!currentWorkspace?.id) {
        return
    }
    return faasbaseApi(await getAccessTokenSilently()).get("clusters?workspace_id=" + currentWorkspace?.id);
}

export const getKubernetesCluster = async ({ queryKey }: any) => {
    const [_key, { getAccessTokenSilently, clusterId }] = queryKey
    return faasbaseApi(await getAccessTokenSilently()).get("clusters/" + clusterId);
}

export const createKubernetesCluster = async (data: any, getAccessTokenSilently: any) => {
    return faasbaseApi(await getAccessTokenSilently()).post("clusters", {
        ...data
    });
}

export const updateKubernetesCluster = async (clusterId: string, data: any, getAccessTokenSilently: any) => {
    return faasbaseApi(await getAccessTokenSilently()).patch("clusters/" + clusterId, {
        ...data
    });
}

export const deleteKubernetesCluster = async (clusterId: string, getAccessTokenSilently: any) => {
    return faasbaseApi(await getAccessTokenSilently()).delete("clusters/" + clusterId);
}


