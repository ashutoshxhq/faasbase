import axios from "axios"


export const faaslyApi = (accessToken: string) => {

    return axios.create({
        baseURL: import.meta.env.VITE_APP_BACKEND_URL || 'https://api.faasly.dev/',
        timeout: 10000,
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
}