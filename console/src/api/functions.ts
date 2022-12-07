import axios from "axios"
import { faaslyApi } from ".";

export const getFunctions = async ({ queryKey }: any) => {
    const [_key, { getAccessTokenSilently, currentWorkspace }] = queryKey
    if (!currentWorkspace?.id) {
        return
    }
    return faaslyApi(await getAccessTokenSilently()).get("functions?workspace_id=" + currentWorkspace?.id);
}

export const searchFunctions = async ({ queryKey }: any) => {
    const [_key, { getAccessTokenSilently, searchQuery}] = queryKey
    return faaslyApi(await getAccessTokenSilently()).get("functions/search?query=" + searchQuery );
}

export const getFunction = async ({ queryKey }: any) => {
    const [_key, { getAccessTokenSilently, functionId }] = queryKey
    return faaslyApi(await getAccessTokenSilently()).get("functions/" + functionId);
}

export const createFunction = async (data: any, getAccessTokenSilently: any) => {

    return faaslyApi(await getAccessTokenSilently()).post("functions", {
        ...data,
    });
}


export const updateFunction = async (functionId: string, data: any, getAccessTokenSilently: any) => {
    return faaslyApi(await getAccessTokenSilently()).patch("functions/" + functionId, {
        ...data
    });
}

export const deleteFunction = async (functionId: string, getAccessTokenSilently: any) => {
    return faaslyApi(await getAccessTokenSilently()).delete("functions/" + functionId);
}

export const getBuilds = async ({ queryKey }: any) => {
    const [_key, { getAccessTokenSilently, functionId }] = queryKey
    return faaslyApi(await getAccessTokenSilently()).get(`functions/${functionId}/builds`);
}

export const getCollaborators = async ({ queryKey }: any) => {
    const [_key, { getAccessTokenSilently, functionId }] = queryKey
    return faaslyApi(await getAccessTokenSilently()).get(`functions/${functionId}/collaborators`);
}

export const deleteCollaboratorFunction = async (functionId: string, collaboratorId: string, getAccessTokenSilently: any) => {
    return faaslyApi(await getAccessTokenSilently()).delete("functions/" + functionId + "/collaborators/" + collaboratorId);
}

export const addCollaboratorFunction = async (functionId: string, collaboratorId: string, permission: string, getAccessTokenSilently: any) => {
    return faaslyApi(await getAccessTokenSilently()).post("functions/" + functionId + "/collaborators", {
        function_id: functionId,
        collaborator_id: collaboratorId,
        permission: permission
    });
}
export const editCollaboratorFunction = async (functionId: string, collaboratorId: string, data: any, getAccessTokenSilently: any) => {
    return faaslyApi(await getAccessTokenSilently()).patch("functions/" + functionId + "/collaborators/" + collaboratorId, {
        ...data
    });
}