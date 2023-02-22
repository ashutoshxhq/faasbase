import axios from "axios"
import { faasbaseApi } from ".";

export const getUser = async ({ queryKey }: any) => {
    const [_key, { getAccessTokenSilently, getIdTokenClaims }] = queryKey;
    let idTokenClaims = await getIdTokenClaims();
    return faasbaseApi(await getAccessTokenSilently()).get("users/" + idTokenClaims?.user_id);
}


export const getUsers = async ({ queryKey }: any) => {
    const [_key, { getAccessTokenSilently }] = queryKey;
    return faasbaseApi(await getAccessTokenSilently()).get("users");
}

export const getUsersByQuery = async (query:string, getAccessTokenSilently:any) => {
    return faasbaseApi(await getAccessTokenSilently()).get("users?query="+query);
}

export const createUser = async (data: any, getAccessTokenSilently: any, getIdTokenClaims: any) => {
    let idTokenClaims = await getIdTokenClaims();

    return faasbaseApi(await getAccessTokenSilently()).post("users", {
        ...data,
        idp_user_id: idTokenClaims.sub,
        team_id: idTokenClaims.team_id
    });
}

export const updateUser = async (id: string, data: any, getAccessTokenSilently: any) => {
    return faasbaseApi(await getAccessTokenSilently()).patch("users/" + id, {
        ...data
    });
}

export const deleteUser = async (id: string, getAccessTokenSilently: any) => {
    return faasbaseApi(await getAccessTokenSilently()).delete("users/" + id);
}

export const getTeam = async ({ queryKey }: any) => {
    const [_key, { getAccessTokenSilently, getIdTokenClaims }] = queryKey;
    let idTokenClaims = await getIdTokenClaims();
    return faasbaseApi(await getAccessTokenSilently()).get("teams/" + idTokenClaims?.team_id);
}

export const updateTeam = async (data: any, getAccessTokenSilently: any, getIdTokenClaims: any) => {
    let idTokenClaims = await getIdTokenClaims();
    return faasbaseApi(await getAccessTokenSilently()).patch("teams/" + idTokenClaims?.team_id, {
        ...data
    });
}