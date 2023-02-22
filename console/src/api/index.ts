import axios from "axios"


export const faasbaseApi = (accessToken: string) => {

    return axios.create({
        baseURL: import.meta.env.VITE_APP_BACKEND_URL || 'https://api.faasbase.com/',
        timeout: 10000,
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
}