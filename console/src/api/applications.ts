import axios from "axios"
import { faasbaseApi } from ".";

export const getApplications = async ({ queryKey }: any) => {
    const [_key, { getAccessTokenSilently, currentWorkspace }] = queryKey
    if (!currentWorkspace?.id) {
        return
    }
    return faasbaseApi(await getAccessTokenSilently()).get("applications?workspace_id=" + currentWorkspace?.id);
}

export const searchApplications = async ({ queryKey }: any) => {
    const [_key, { getAccessTokenSilently, searchQuery }] = queryKey
    return faasbaseApi(await getAccessTokenSilently()).get("applications/search?query=" + searchQuery);
}

export const getApplication = async ({ queryKey }: any) => {
    const [_key, { getAccessTokenSilently, applicationId }] = queryKey
    return faasbaseApi(await getAccessTokenSilently()).get("applications/" + applicationId);
}

export const createApplication = async (data: any, getAccessTokenSilently: any) => {
    return faasbaseApi(await getAccessTokenSilently()).post("applications", {
        ...data
    });
}

export const updateApplication = async (applicationId: string, data: any, getAccessTokenSilently: any) => {
    return faasbaseApi(await getAccessTokenSilently()).patch("applications/" + applicationId, {
        ...data
    });
}

export const deleteApplication = async (applicationId: string, getAccessTokenSilently: any) => {
    return faasbaseApi(await getAccessTokenSilently()).delete("applications/" + applicationId);
}

export const getApplicationEvents = async ({ queryKey }: any) => {
    const [_key, { getAccessTokenSilently, applicationId }] = queryKey
    return faasbaseApi(await getAccessTokenSilently()).get("applications/" + applicationId + "/events");
}

export const getApplicationEventLogs = async ({ queryKey }: any) => {
    const [_key, { getAccessTokenSilently, applicationId, eventId }] = queryKey
    if (!eventId) return { data: {} }
    return faasbaseApi(await getAccessTokenSilently()).get("applications/" + applicationId + "/events/" + eventId + "/logs");
}

export const getApplicationResources = async ({ queryKey }: any) => {
    const [_key, { getAccessTokenSilently, applicationId }] = queryKey

    return faasbaseApi(await getAccessTokenSilently()).get("applications/" + applicationId + "/resources");
}

export const getApplicationResource = async ({ queryKey }: any) => {
    const [_key, { getAccessTokenSilently, applicationId, resourceId }] = queryKey
    return faasbaseApi(await getAccessTokenSilently()).get("applications/" + applicationId + "/resources/" + resourceId);
}

export const createApplicationResource = async (applicationId: string, data: any, getAccessTokenSilently: any) => {

    return faasbaseApi(await getAccessTokenSilently()).post("applications/" + applicationId + "/resources", {
        ...data,
    });
}

export const updateApplicationResource = async (applicationId: string, resourceId: string, data: any, getAccessTokenSilently: any) => {
    return faasbaseApi(await getAccessTokenSilently()).patch("applications/" + applicationId + "/resources/" + resourceId, {
        ...data
    });
}

export const deleteApplicationResource = async (applicationId: string, resourceId: string, getAccessTokenSilently: any) => {
    return faasbaseApi(await getAccessTokenSilently()).delete("applications/" + applicationId + "/resources/" + resourceId);
}


export const getApplicationCollaborators = async ({ queryKey }: any) => {
    const [_key, { getAccessTokenSilently, applicationId }] = queryKey
    return faasbaseApi(await getAccessTokenSilently()).get("applications/" + applicationId + "/collaborators");
}

export const createApplicationCollaborator = async (applicationId: string, data: any, getAccessTokenSilently: any) => {
    return faasbaseApi(await getAccessTokenSilently()).post("applications/" + applicationId + "/collaborators", {
        ...data,
    });
}

export const updateApplicationCollaborator = async (applicationId: string, collaboratorId: string, data: any, getAccessTokenSilently: any) => {
    return faasbaseApi(await getAccessTokenSilently()).patch("applications/" + applicationId + "/collaborators/" + collaboratorId, {
        ...data
    });
}

export const deleteApplicationCollaborator = async (applicationId: string, collaboratorId: string, getAccessTokenSilently: any) => {
    return faasbaseApi(await getAccessTokenSilently()).delete("applications/" + applicationId + "/collaborators/" + collaboratorId);
}


export const getApplicationBuilds = async ({ queryKey }: any) => {
    const [_key, { getAccessTokenSilently, applicationId }] = queryKey
    return faasbaseApi(await getAccessTokenSilently()).get("applications/" + applicationId + "/builds");
}

export const createApplicationBuild = async (applicationId: string, data: any, getAccessTokenSilently: any) => {
    return faasbaseApi(await getAccessTokenSilently()).post("applications/" + applicationId + "/builds", {
        ...data,
    });
}