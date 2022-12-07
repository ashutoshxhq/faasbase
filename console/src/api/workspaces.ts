import { faaslyApi } from ".";

export const getWorkspaces = async ({ queryKey }: any) => {
    const [_key, { getAccessTokenSilently }] = queryKey
    return faaslyApi(await getAccessTokenSilently()).get("workspaces");
}

export const getWorkspace = async ({ queryKey }: any) => {
    const [_key, { getAccessTokenSilently, workspaceId }] = queryKey
    return faaslyApi(await getAccessTokenSilently()).get("workspaces/" + workspaceId);
}

export const getCurrentWorkspace = async ({ queryKey }: any) => {
    const [_key, { getAccessTokenSilently, currentWorkspace }] = queryKey
    return faaslyApi(await getAccessTokenSilently()).get("workspaces/" + currentWorkspace.id);
}

export const createWorkspace = async (data: any, getAccessTokenSilently: any) => {
    return faaslyApi(await getAccessTokenSilently()).post("workspaces", {
        ...data
    });
}

export const updateWorkspace = async (workspaceId: string, data: any, getAccessTokenSilently: any) => {
    return faaslyApi(await getAccessTokenSilently()).patch("workspaces/" + workspaceId, {
        ...data
    });
}

export const deleteWorkspace = async (workspaceId: string, getAccessTokenSilently: any) => {
    return faaslyApi(await getAccessTokenSilently()).delete("workspaces/" + workspaceId);
}


export const getCurrentWorkspaceMembers = async ({ queryKey }: any) => {
    const [_key, { getAccessTokenSilently, currentWorkspace }] = queryKey
    return faaslyApi(await getAccessTokenSilently()).get("workspaces/" + currentWorkspace.id + "/members");
}

export const createWorkspaceMember = async (data: any, getAccessTokenSilently: any) => {
    return faaslyApi(await getAccessTokenSilently()).post("workspaces/" + data?.workspace_id + "/members", {
        ...data
    });
}

export const updateWorkspaceMember = async (memberId: string, data: any, getAccessTokenSilently: any) => {
    return faaslyApi(await getAccessTokenSilently()).patch("workspaces/" + data?.workspace_id + "/members/" + memberId, {
        ...data
    });
}

export const deleteWorkspaceMember = async (workspaceId: string, memberId: string, getAccessTokenSilently: any) => {
    return faaslyApi(await getAccessTokenSilently()).delete("workspaces/" + workspaceId + "/members/"+ memberId);
}