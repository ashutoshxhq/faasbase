import { faaslyApi } from ".";


export const getKubernetesClusters = async ({ queryKey }: any) => {
    const [_key, { getAccessTokenSilently, currentWorkspace }] = queryKey
    if (!currentWorkspace?.id) {
        return
    }
    return faaslyApi(await getAccessTokenSilently()).get("clusters?workspace_id=" + currentWorkspace?.id);
}

export const getKubernetesCluster = async ({ queryKey }: any) => {
    const [_key, { getAccessTokenSilently, clusterId }] = queryKey
    return faaslyApi(await getAccessTokenSilently()).get("clusters/" + clusterId);
}

export const createKubernetesCluster = async (data: any, getAccessTokenSilently: any) => {
    return faaslyApi(await getAccessTokenSilently()).post("clusters", {
        ...data
    });
}

export const updateKubernetesCluster = async (clusterId: string, data: any, getAccessTokenSilently: any) => {
    return faaslyApi(await getAccessTokenSilently()).patch("clusters/" + clusterId, {
        ...data
    });
}

export const deleteKubernetesCluster = async (clusterId: string, getAccessTokenSilently: any) => {
    return faaslyApi(await getAccessTokenSilently()).delete("clusters/" + clusterId);
}


